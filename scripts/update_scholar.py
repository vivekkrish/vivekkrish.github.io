import urllib.request
import re
import ssl
import json
import os

def fetch_scholar_stats(user_id):
    # Try multiple regional domains to bypass IP/regional blocks
    domains = [
        "scholar.google.com",
        "scholar.google.co.uk",
        "scholar.google.ca",
        "scholar.google.de",
        "scholar.google.es",
        "scholar.google.fr",
        "scholar.google.co.in",
        "scholar.google.com.au",
        "scholar.google.ch",
        "scholar.google.se"
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
    }
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    last_exception = None
    for domain in domains:
        url = f"https://{domain}/citations?user={user_id}&hl=en&pagesize=100"
        headers['Referer'] = f"https://{domain}/"
        print(f"Attempting to fetch Google Scholar data from: {domain}...")
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, context=ctx) as response:
                html_content = response.read().decode('utf-8', errors='replace')
                print(f"Successfully fetched Google Scholar data from: {domain}")
                return html_content
        except urllib.error.HTTPError as e:
            print(f"HTTP Error {e.code} when fetching from {domain}")
            last_exception = e
        except Exception as e:
            print(f"Error fetching from {domain}: {e}")
            last_exception = e
            
    if last_exception:
        raise last_exception
    raise Exception("Failed to fetch from all Google Scholar domains")

def parse_scholar_html(html):
    # 1. Extract Citation Stats
    stats_matches = re.findall(r'<td class="gsc_rsb_std">(\d+)</td>', html)
    if len(stats_matches) < 6:
        raise ValueError("Could not find all standard metrics in Google Scholar HTML.")
        
    stats = {
        "citations": int(stats_matches[0]),
        "hIndex": int(stats_matches[2]),
        "i10Index": int(stats_matches[4])
    }
    
    # 2. Extract Yearly Citation History (Coordinates-matched)
    year_matches = re.findall(r'<span[^>]*class="gsc_g_t"[^>]*style="(?:right|left):(\d+)px"[^>]*>(\d{4})</span>', html)
    bar_matches = re.findall(r'<a[^>]*class="gsc_g_a"[^>]*style="[^"]*(?:right|left):(\d+)px[^"]*"[^>]*>.*?<span class="gsc_g_al">(\d+)</span>', html, re.DOTALL)
    
    history = {}
    for y_pos, year in year_matches:
        y_pos_val = int(y_pos)
        best_val = 0
        min_diff = 999
        for b_pos, count in bar_matches:
            b_pos_val = int(b_pos)
            diff = abs(y_pos_val - b_pos_val)
            if diff < min_diff and diff < 15:
                min_diff = diff
                best_val = int(count)
        history[int(year)] = best_val
        
    sorted_history = []
    for yr in sorted(history.keys()):
        sorted_history.append({
            "year": yr,
            "citations": history[yr]
        })
        
    # 3. Extract Publications List
    rows = re.findall(r'<tr class="gsc_a_tr">(.*?)</tr>', html, re.DOTALL)
    publications = []
    
    for row in rows:
        # Title and URL
        title_a_match = re.search(r'<a[^>]+class="gsc_a_at"[^>]*>.*?</a>', row, re.DOTALL)
        if not title_a_match:
            continue
        title_a = title_a_match.group(0)
        
        href_match = re.search(r'href="([^"]+)"', title_a)
        cite_url = "https://scholar.google.com" + href_match.group(1).replace("&amp;", "&") if href_match else ""
        title = re.sub(r'<[^>]*>', '', title_a).strip()
        
        # Authors and Venue
        divs = re.findall(r'<div class="gs_gray">(.*?)</div>', row, re.DOTALL)
        if len(divs) < 2:
            continue
            
        authors = re.sub(r'<[^>]*>', '', divs[0]).strip()
        venue_raw = re.sub(r'<[^>]*>', '', divs[1]).strip()
        
        # Year
        year_match = re.search(r'<span class="gsc_a_h gsc_a_hc gs_ibl">(\d{4})</span>', row)
        year = year_match.group(1) if year_match else ""
        
        # Clean venue
        venue = venue_raw
        if year and venue.endswith(year):
            venue = re.sub(r',\s*' + year + r'$', '', venue).strip()
            venue = re.sub(r'\s*' + year + r'$', '', venue).strip()
            
        # Citations
        citations_a_match = re.search(r'<a[^>]+class="gsc_a_ac[^"]*"[^>]*>.*?</a>', row, re.DOTALL)
        citations = 0
        citations_url = ""
        if citations_a_match:
            citations_a = citations_a_match.group(0)
            c_href_match = re.search(r'href="([^"]+)"', citations_a)
            if c_href_match:
                citations_url = c_href_match.group(1).replace("&amp;", "&")
                if not citations_url.startswith("http"):
                    citations_url = "https://scholar.google.com" + citations_url
            
            c_count_text = re.sub(r'<[^>]*>', '', citations_a).strip()
            if c_count_text.isdigit():
                citations = int(c_count_text)
                
        publications.append({
            "title": title,
            "authors": authors,
            "venue": venue,
            "year": int(year) if year else None,
            "citations": citations,
            "cite_url": cite_url,
            "citations_url": citations_url,
            "scholar_cite_url": cite_url,
            "scholar_citations_url": citations_url,
            "semantic_cite_url": "",
            "semantic_citations_url": ""
        })
        
    return stats, sorted_history, publications

def fetch_semantic_scholar_stats(author_id):
    url = f"https://api.semanticscholar.org/graph/v1/author/{author_id}?fields=name,citationCount,hIndex,paperCount,papers.title,papers.year,papers.citationCount,papers.venue,papers.authors,papers.url"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as response:
        data = json.loads(response.read().decode('utf-8'))
        
    papers = data.get("papers", [])
    
    # Calculate metrics
    citations = data.get("citationCount", 0)
    h_index = data.get("hIndex", 0)
    i10_index = sum(1 for p in papers if p.get("citationCount", 0) >= 10)
    
    stats = {
        "citations": citations,
        "hIndex": h_index,
        "i10Index": i10_index,
        "papersCount": len(papers)
    }
    
    # Map publications
    publications = []
    for paper in papers:
        authors_list = [a.get("name", "") for a in paper.get("authors", [])]
        authors_str = ", ".join(authors_list)
        
        # Match year format
        year = paper.get("year")
        if year is not None:
            try:
                year = int(year)
            except ValueError:
                year = None
                
        cite_url = paper.get("url") or ""
        citations_url = (cite_url + "/citing") if cite_url else ""
        
        publications.append({
            "title": paper.get("title", ""),
            "authors": authors_str,
            "venue": paper.get("venue", "") or "",
            "year": year,
            "citations": paper.get("citationCount", 0),
            "cite_url": cite_url,
            "citations_url": citations_url,
            "scholar_cite_url": "",
            "scholar_citations_url": "",
            "semantic_cite_url": cite_url,
            "semantic_citations_url": citations_url
        })
        
    # Sort by citations descending
    publications.sort(key=lambda x: x["citations"], reverse=True)
    
    return stats, publications

def fuse_publications(scholar_pubs, semantic_pubs):
    # Create lookup map for semantic scholar publications by normalized title
    s2_map = {}
    for pub in semantic_pubs:
        norm_title = re.sub(r'[^a-z0-9]', '', pub['title'].lower())
        s2_map[norm_title] = pub

    fused = []
    # Match scholar publications to semantic publications
    for spub in scholar_pubs:
        norm_title = re.sub(r'[^a-z0-9]', '', spub['title'].lower())
        if norm_title in s2_map:
            s2_pub = s2_map[norm_title]
            
            # Prefer Semantic Scholar's clean metadata (author list without truncation, clean venue, year)
            authors = s2_pub['authors']
            venue = s2_pub['venue'] if s2_pub['venue'] else spub['venue']
            year = s2_pub['year'] if s2_pub['year'] is not None else spub['year']
            
            # Prefer Google Scholar's citation count
            citations = max(spub['citations'], s2_pub['citations'])
            
            # Combine URLs
            scholar_cite_url = spub['scholar_cite_url'] or spub['cite_url'] or s2_pub.get('scholar_cite_url', '')
            scholar_citations_url = spub['scholar_citations_url'] or spub['citations_url'] or s2_pub.get('scholar_citations_url', '')
            semantic_cite_url = s2_pub['semantic_cite_url'] or s2_pub['cite_url'] or spub.get('semantic_cite_url', '')
            semantic_citations_url = s2_pub['semantic_citations_url'] or s2_pub['citations_url'] or spub.get('semantic_citations_url', '')
            
            # Main fallback URLs: prefer Google Scholar links if available, else Semantic Scholar
            cite_url = scholar_cite_url or semantic_cite_url
            citations_url = scholar_citations_url or semantic_citations_url
            
            fused.append({
                "title": s2_pub['title'], # keep the clean casing/title from S2
                "authors": authors,
                "venue": venue,
                "year": year,
                "citations": citations,
                "cite_url": cite_url,
                "citations_url": citations_url,
                "scholar_cite_url": scholar_cite_url,
                "scholar_citations_url": scholar_citations_url,
                "semantic_cite_url": semantic_cite_url,
                "semantic_citations_url": semantic_citations_url
            })
            
            # Remove from s2_map to track what's left
            del s2_map[norm_title]
        else:
            # Not in Semantic Scholar, keep Google Scholar record as is
            fused.append(spub)
            
    # Add any remaining Semantic Scholar publications that weren't in Google Scholar
    for s2_pub in s2_map.values():
        fused.append(s2_pub)
        
    return fused

def deduplicate_publications(publications):
    seen = {}
    for pub in publications:
        # Normalize title: lowercase, alphanumeric only
        norm_title = re.sub(r'[^a-z0-9]', '', pub['title'].lower())
        if norm_title not in seen:
            seen[norm_title] = pub
        else:
            existing = seen[norm_title]
            # Keep version with higher citations
            if pub['citations'] > existing['citations']:
                seen[norm_title] = pub
            elif pub['citations'] == existing['citations']:
                # If citation count is equal, prefer the one with a non-empty venue
                if pub.get('venue') and not existing.get('venue'):
                    seen[norm_title] = pub
    
    # Sort final list by citations descending
    deduped = list(seen.values())
    deduped.sort(key=lambda x: x["citations"], reverse=True)
    return deduped

def main():
    config_path = "assets/resources/profile_config.json"
    scholar_stats_path = "assets/resources/citation_metrics.json"
    pub_path = "assets/resources/publications_list.json"
    
    if not os.path.exists(config_path):
      print(f"Error: {config_path} not found.")
      return
        
    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)
        
    scholar_id = config.get("scholar")
    if not scholar_id:
        print("Error: 'scholar' key not found in profile_config.json.")
        return
        
    # 1. Fetch Semantic Scholar data first as a base of clean metadata
    semantic_pubs = []
    s2_stats = None
    semantic_scholar_id = config.get("semanticScholar")
    if semantic_scholar_id:
        print(f"Fetching Semantic Scholar data for author ID: {semantic_scholar_id}...")
        try:
            s2_stats, semantic_pubs = fetch_semantic_scholar_stats(semantic_scholar_id)
            print(f"Successfully fetched {len(semantic_pubs)} publications from Semantic Scholar.")
        except Exception as e:
            print(f"Warning: Failed to fetch Semantic Scholar data: {e}")

    # 2. Attempt to fetch Google Scholar and enrich
    print(f"Fetching Google Scholar data for user: {scholar_id}...")
    source_used = "Google Scholar"
    try:
        html = fetch_scholar_stats(scholar_id)
        stats, history, scholar_pubs = parse_scholar_html(html)
        print("Successfully fetched and parsed Google Scholar data.")
        
        if semantic_pubs:
            publications = fuse_publications(scholar_pubs, semantic_pubs)
            print("Successfully fused Google Scholar and Semantic Scholar data.")
            source_used = "Google Scholar + Semantic Scholar (Enriched)"
        else:
            publications = scholar_pubs
            source_used = "Google Scholar Only"
            
    except Exception as e:
        print(f"Failed to fetch Google Scholar data: {e}")
        if not semantic_pubs:
            print("Error: Could not retrieve publication data from Google Scholar or Semantic Scholar. Exiting.")
            import sys
            sys.exit(1)
            
        print("Falling back entirely to Semantic Scholar data...")
        publications = semantic_pubs
        stats = s2_stats
        source_used = "Semantic Scholar Only"
        
        # Load existing citationsHistory from citation_metrics.json if available
        history = []
        if os.path.exists(scholar_stats_path):
            try:
                with open(scholar_stats_path, "r", encoding="utf-8") as f_hist:
                    existing_data = json.load(f_hist)
                    history = existing_data.get("citationsHistory", [])
                    print("Preserved existing citationsHistory from cached metrics.")
            except Exception as he:
                print(f"Warning: Could not read existing citation history: {he}")
        
    publications = deduplicate_publications(publications)
    
    print(f"\n--- Metrics ({source_used}) ---")
    print(f"Citations: {stats['citations']}")
    print(f"h-index: {stats['hIndex']}")
    print(f"i10-index: {stats['i10Index']}")
    print(f"Total Publications: {len(publications)}")
    
    # Prepare stats object
    scholar_stats = {
        "scholarStats": {
            "citations": stats["citations"],
            "hIndex": stats["hIndex"],
            "i10Index": stats["i10Index"],
            "papersCount": len(publications)
        },
        "citationsHistory": history
    }
    
    # Write to scholar_stats.json
    with open(scholar_stats_path, "w", encoding="utf-8") as f:
        json.dump(scholar_stats, f, indent=2, ensure_ascii=False)
    print(f"Successfully updated {scholar_stats_path} with live metrics.")
    
    # Write publications array to publications.json
    with open(pub_path, "w", encoding="utf-8") as f:
        json.dump(publications, f, indent=2, ensure_ascii=False)
    print(f"Successfully updated {pub_path} with {len(publications)} publications.")

if __name__ == "__main__":
    main()
