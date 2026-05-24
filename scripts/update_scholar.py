import urllib.request
import re
import ssl
import json
import os

def fetch_scholar_stats(user_id):
    # Retrieve all publications by setting pagesize=100
    url = f"https://scholar.google.com/citations?user={user_id}&hl=en&pagesize=100"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as response:
        return response.read().decode('utf-8', errors='replace')

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
            "citations_url": citations_url
        })
        
    return stats, sorted_history, publications

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
        
    print(f"Fetching Google Scholar data for user: {scholar_id}...")
    try:
        html = fetch_scholar_stats(scholar_id)
        stats, history, publications = parse_scholar_html(html)
        
        print("\n--- Scraped Google Scholar Metrics ---")
        print(f"Citations: {stats['citations']}")
        print(f"h-index: {stats['hIndex']}")
        print(f"i10-index: {stats['i10Index']}")
        print(f"Total Parsed Publications: {len(publications)}")
        
        # Prepare scholar stats object
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
        
    except Exception as e:
        print(f"Error updating Google Scholar stats and publications: {e}")

if __name__ == "__main__":
    main()
