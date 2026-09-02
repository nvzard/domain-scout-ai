#!/usr/bin/env python3
"""
Domain Scout AI — High-Fidelity Store Asset Generator
Generates pixel-perfect Chrome Web Store & Firefox Add-on screenshots,
small promo tiles (440x280), and marquee promo banners (1400x560)
using REAL Chrome rendering of popup.html.
"""

import os
import json
import shutil
import tempfile
import subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(ROOT_DIR, "src")
STORE_ASSETS_DIR = os.path.join(ROOT_DIR, "store-assets")
ICON_PATH = os.path.join(SRC_DIR, "icons", "icon-128.png")
CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

os.makedirs(STORE_ASSETS_DIR, exist_ok=True)

SAMPLE_RESULTS = [
    {"domain": "agentflow.ai", "name": "agentflow", "tld": "ai", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "synapsetask.io", "name": "synapsetask", "tld": "io", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "worknova.ai", "name": "worknova", "tld": "ai", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "autocortex.com", "name": "autocortex", "tld": "com", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "promptnest.io", "name": "promptnest", "tld": "io", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "mindgrid.ai", "name": "mindgrid", "tld": "ai", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "taskpulse.dev", "name": "taskpulse", "tld": "dev", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "flowdock.io", "name": "flowdock", "tld": "io", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "logicdeck.com", "name": "logicdeck", "tld": "com", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "omnicraft.ai", "name": "omnicraft", "tld": "ai", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "agentflow.com", "name": "agentflow", "tld": "com", "isAvailable": False, "isRegistered": True, "isAftermarket": True, "marketPrice": 1499, "marketName": "Afternic"},
    {"domain": "synapse.ai", "name": "synapse", "tld": "ai", "isAvailable": False, "isRegistered": True, "isAftermarket": False},
    {"domain": "synapse.com", "name": "synapse", "tld": "com", "isAvailable": False, "isRegistered": True, "isAftermarket": False},
    {"domain": "worknova.com", "name": "worknova", "tld": "com", "isAvailable": False, "isRegistered": True, "isAftermarket": False},
    {"domain": "cortex.io", "name": "cortex", "tld": "io", "isAvailable": False, "isRegistered": True, "isAftermarket": True, "marketPrice": 2800, "marketName": "Sedo"}
]

def get_font(size, bold=False):
    font_paths = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

def create_gradient_bg(width, height, top_color, bot_color, glow_center=None, glow_color=(99, 102, 241, 60)):
    bg = Image.new("RGB", (width, height), top_color)
    draw = ImageDraw.Draw(bg)
    
    for y in range(height):
        t = y / float(height)
        r = int(top_color[0] * (1 - t) + bot_color[0] * t)
        g = int(top_color[1] * (1 - t) + bot_color[1] * t)
        b = int(top_color[2] * (1 - t) + bot_color[2] * t)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
        
    if glow_center:
        cx, cy, max_radius = glow_center
        glow_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        glow_draw = ImageDraw.Draw(glow_layer)
        for rad in range(max_radius, 0, -8):
            factor = (1.0 - (rad / max_radius)) ** 2
            alpha = int(glow_color[3] * factor)
            if alpha > 0:
                col = (glow_color[0], glow_color[1], glow_color[2], alpha)
                glow_draw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=col)
        bg = Image.alpha_composite(bg.convert("RGBA"), glow_layer).convert("RGB")
        
    return bg

def round_corners_and_shadow(img, radius=16, border_color=(99, 102, 241, 160), border_width=1, shadow_offset=16, shadow_blur=26):
    img = img.convert("RGBA")
    w, h = img.size
    
    mask = Image.new("L", (w, h), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, w, h], radius=radius, fill=255)
    
    img_with_mask = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    img_with_mask.paste(img, (0, 0), mask=mask)
    
    border_draw = ImageDraw.Draw(img_with_mask)
    border_draw.rounded_rectangle([0, 0, w - 1, h - 1], radius=radius, outline=border_color, width=border_width)
    
    pad = shadow_blur * 2
    sw = w + pad * 2
    sh = h + pad * 2 + shadow_offset
    shadow_img = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_img)
    
    sdraw.rounded_rectangle([pad, pad + shadow_offset, pad + w, pad + shadow_offset + h], radius=radius, fill=(0, 0, 0, 200))
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(shadow_blur))
    
    shadow_img.paste(img_with_mask, (pad, pad), mask=img_with_mask)
    return shadow_img, pad

def render_real_popup_state(state_config, output_png, window_height=640):
    with tempfile.TemporaryDirectory() as tmpdir:
        shutil.copytree(SRC_DIR, tmpdir, dirs_exist_ok=True)
        html_path = os.path.join(tmpdir, "popup.html")
        with open(html_path, "r", encoding="utf-8") as f:
            html = f.read()
            
        custom_css = state_config.get("customCss", "")
        style_inject = f"<style>{custom_css}</style>" if custom_css else ""
        
        script_code = f"""
        {style_inject}
        <script>
          // Pre-populate real storage state
          localStorage.setItem('dc_currentMode', JSON.stringify({json.dumps(state_config.get('currentMode', 'ai'))}));
          localStorage.setItem('dc_aiPrompt', JSON.stringify({json.dumps(state_config.get('aiPrompt', ''))}));
          localStorage.setItem('dc_aiProvider', JSON.stringify({json.dumps(state_config.get('aiProvider', 'smart_brain'))}));
          localStorage.setItem('dc_domainInput', JSON.stringify({json.dumps(state_config.get('domainInput', ''))}));
          localStorage.setItem('dc_preferredTlds', JSON.stringify({json.dumps(state_config.get('preferredTlds', ['com', 'io', 'ai']))}));
          localStorage.setItem('dc_lastAiMeta', JSON.stringify({json.dumps(state_config.get('lastAiMeta', None))}));
          localStorage.setItem('dc_lastResults', JSON.stringify({json.dumps(state_config.get('lastResults', []))}));
          localStorage.setItem('dc_starredDomains', JSON.stringify({json.dumps(state_config.get('starredDomains', []))}));
          localStorage.setItem('dc_currentFilter', JSON.stringify({json.dumps(state_config.get('currentFilter', 'available'))}));
        </script>
        """
        
        post_script = ""
        if state_config.get("openRegistrarDropdown"):
            post_script = """
            <script>
              window.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                  const btn = document.querySelector('.btn-continue');
                  if (btn) btn.click();
                }, 150);
              });
            </script>
            """
            
        html = html.replace("<head>", "<head>" + script_code)
        if post_script:
            html = html.replace("</body>", post_script + "</body>")
            
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html)
            
        cmd = [
            CHROME_BIN,
            "--headless=new",
            "--disable-gpu",
            "--force-device-scale-factor=2",
            "--hide-scrollbars",
            f"--window-size=550,{window_height}",
            f"--screenshot={output_png}",
            f"file://{html_path}"
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

# ---------------------------------------------------------
# Real Screenshot Configurations (5 States)
# ---------------------------------------------------------

RESULTS_SAMPLE_SCREENSHOT_4 = [
    {"domain": "snaphunt.co", "name": "snaphunt", "tld": "co", "isAvailable": False, "isRegistered": True, "isAftermarket": False},
    {"domain": "prodmingle.com", "name": "prodmingle", "tld": "com", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "prodmingle.ai", "name": "prodmingle", "tld": "ai", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "prodmingle.io", "name": "prodmingle", "tld": "io", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "questnest.com", "name": "questnest", "tld": "com", "isAvailable": False, "isRegistered": True, "isAftermarket": True, "marketPrice": 2997, "marketName": "Afternic"},
    {"domain": "launchhive.ai", "name": "launchhive", "tld": "ai", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "productnest.dev", "name": "productnest", "tld": "dev", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "huntforge.io", "name": "huntforge", "tld": "io", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "scoutcraft.ai", "name": "scoutcraft", "tld": "ai", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "makerspot.app", "name": "makerspot", "tld": "app", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "founderfeed.io", "name": "founderfeed", "tld": "io", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "techscout.co", "name": "techscout", "tld": "co", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "launchpulse.dev", "name": "launchpulse", "tld": "dev", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "makerbase.io", "name": "makerbase", "tld": "io", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "buildhunt.ai", "name": "buildhunt", "tld": "ai", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "launchgrid.co", "name": "launchgrid", "tld": "co", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "indiespot.dev", "name": "indiespot", "tld": "dev", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "shipflow.ai", "name": "shipflow", "tld": "ai", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "appscout.io", "name": "appscout", "tld": "io", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "curatehub.co", "name": "curatehub", "tld": "co", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "launchvibe.app", "name": "launchvibe", "tld": "app", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "buildwave.ai", "name": "buildwave", "tld": "ai", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "makerhive.io", "name": "makerhive", "tld": "io", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "venturestack.dev", "name": "venturestack", "tld": "dev", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "shipradar.ai", "name": "shipradar", "tld": "ai", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "prodhunt.co", "name": "prodhunt", "tld": "co", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "indielaunch.org", "name": "indielaunch", "tld": "org", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "indieflow.app", "name": "indieflow", "tld": "app", "isAvailable": True, "isRegistered": False, "isAftermarket": False},
    {"domain": "producthunt.io", "name": "producthunt", "tld": "io", "isAvailable": False, "isRegistered": True, "isAftermarket": True, "marketPrice": 4500, "marketName": "Sedo"},
    {"domain": "launchpad.ai", "name": "launchpad", "tld": "ai", "isAvailable": False, "isRegistered": True, "isAftermarket": True, "marketPrice": 12500, "marketName": "Afternic"},
    {"domain": "makerhub.com", "name": "makerhub", "tld": "com", "isAvailable": False, "isRegistered": True, "isAftermarket": True, "marketPrice": 3200, "marketName": "Afternic"},
    {"domain": "techhunt.com", "name": "techhunt", "tld": "com", "isAvailable": False, "isRegistered": True, "isAftermarket": True, "marketPrice": 1800, "marketName": "Dan"},
    {"domain": "indiehunt.io", "name": "indiehunt", "tld": "io", "isAvailable": False, "isRegistered": True, "isAftermarket": True, "marketPrice": 2400, "marketName": "GoDaddy"},
    {"domain": "producthunt.com", "name": "producthunt", "tld": "com", "isAvailable": False, "isRegistered": True, "isAftermarket": False},
    {"domain": "producthunt.ai", "name": "producthunt", "tld": "ai", "isAvailable": False, "isRegistered": True, "isAftermarket": False},
    {"domain": "betalist.com", "name": "betalist", "tld": "com", "isAvailable": False, "isRegistered": True, "isAftermarket": False},
    {"domain": "betalist.io", "name": "betalist", "tld": "io", "isAvailable": False, "isRegistered": True, "isAftermarket": False},
    {"domain": "launchingnext.com", "name": "launchingnext", "tld": "com", "isAvailable": False, "isRegistered": True, "isAftermarket": False},
    {"domain": "indiehackers.com", "name": "indiehackers", "tld": "com", "isAvailable": False, "isRegistered": True, "isAftermarket": False},
    {"domain": "hackernews.com", "name": "hackernews", "tld": "com", "isAvailable": False, "isRegistered": True, "isAftermarket": False},
    {"domain": "productstash.io", "name": "productstash", "tld": "io", "isAvailable": False, "isRegistered": True, "isAftermarket": False},
    {"domain": "alternativeto.net", "name": "alternativeto", "tld": "net", "isAvailable": False, "isRegistered": True, "isAftermarket": False},
    {"domain": "startupstash.com", "name": "startupstash", "tld": "com", "isAvailable": False, "isRegistered": True, "isAftermarket": False},
    {"domain": "toolhunt.com", "name": "toolhunt", "tld": "com", "isAvailable": False, "isRegistered": True, "isAftermarket": False},
    {"domain": "sideprojectors.com", "name": "sideprojectors", "tld": "com", "isAvailable": False, "isRegistered": True, "isAftermarket": False},
    {"domain": "microlaunch.net", "name": "microlaunch", "tld": "net", "isAvailable": False, "isRegistered": True, "isAftermarket": False},
    {"domain": "uneed.best", "name": "uneed", "tld": "best", "isAvailable": False, "isRegistered": True, "isAftermarket": False},
    {"domain": "saashub.com", "name": "saashub", "tld": "com", "isAvailable": False, "isRegistered": True, "isAftermarket": False}
]

SCREENSHOTS = [
    {
        "config": {
            "currentMode": "ai",
            "aiPrompt": "AI agent for automated productivity, meeting notes & smart workflows",
            "aiProvider": "openrouter",
            "preferredTlds": ["com", "io", "ai"],
            "lastResults": [],
            "lastAiMeta": None
        },
        "window_height": 550,
        "tag": "MULTI-MODEL AI SCOUT",
        "title": "Brainstorm Domain Names Fast with AI",
        "subtitle": "Describe any product or startup idea — AI brainstorms & auto-hunts available domains",
        "out": "screenshot-1-search-input.jpg"
    },
    {
        "config": {
            "currentMode": "ai",
            "aiPrompt": "AI agent for automated productivity, meeting notes & smart workflows",
            "aiProvider": "smart_brain",
            "preferredTlds": ["com", "io", "ai"],
            "lastAiMeta": {
                "prompt": "AI agent for automated productivity, meeting notes & smart workflows",
                "rounds": 2,
                "totalChecked": 28,
                "availableCount": 10,
                "engine": "smart_brain",
                "engineName": "Smart Brain (Offline)"
            },
            "lastResults": SAMPLE_RESULTS,
            "starredDomains": ["agentflow.ai", "synapsetask.io", "autocortex.com"],
            "currentFilter": "available"
        },
        "window_height": 640,
        "tag": "10 AVAILABLE FOUND",
        "title": "Autonomous AI Hunt Across Iterative Rounds",
        "subtitle": "Auto-exclusion loop detects taken names and iterates until 10 available domains are found",
        "out": "screenshot-2-results-overview.jpg"
    },
    {
        "config": {
            "currentMode": "manual",
            "domainInput": "1. **LaunchScout** (.com, .io, .ai) — Curated discovery platform\\n2. **Noviqo** (com / co) — Modern AI assistant\\n3. *Brevio* [Short & brandable]\\n4. DevPulse (.dev, .io) — Developer tools\\n5. [CloudForge](https://cloudforge.dev)",
            "preferredTlds": ["com", "io", "ai", "co", "dev", "app"],
            "lastResults": [],
            "lastAiMeta": None
        },
        "window_height": 550,
        "tag": "MANUAL BULK SEARCH",
        "title": "Paste ChatGPT Lists, Markdown Tables & Notes",
        "subtitle": "Handles raw chat transcripts, parenthetical TLDs, JSON arrays & 1-click startup variations",
        "out": "screenshot-3-registrars-continue.jpg"
    },
    {
        "config": {
            "currentMode": "ai",
            "aiPrompt": "product hunt alternatives",
            "aiProvider": "openrouter",
            "preferredTlds": ["com", "io", "ai", "co", "dev", "app", "org", "net"],
            "lastAiMeta": {
                "prompt": "product hunt alternatives",
                "rounds": 2,
                "totalChecked": 48,
                "availableCount": 26,
                "engine": "openrouter",
                "engineName": "OpenRouter"
            },
            "lastResults": RESULTS_SAMPLE_SCREENSHOT_4,
            "starredDomains": [],
            "currentFilter": "all",
            "customCss": """
              .app-header, .mode-tabs, #sectionAi, #sectionManual, .preferences-section .section-header, .tld-chips-container, .input-with-btn {
                display: none !important;
              }
              body {
                padding: 10px 16px 14px 16px !important;
                margin: 0 !important;
              }
              .preferences-section {
                padding: 0 0 6px 0 !important;
                margin: 0 0 6px 0 !important;
                border: none !important;
                background: transparent !important;
              }
              .quick-tlds-wrapper {
                width: 100% !important;
              }
              .results-dashboard {
                margin-top: 0 !important;
              }
              .results-list {
                max-height: none !important;
                overflow-y: visible !important;
              }
              .domain-item {
                margin-bottom: 6px !important;
                padding: 8px 12px !important;
              }
            """
        },
        "window_height": 698,
        "tag": "AVAILABLE • TAKEN • FOR SALE",
        "title": "Compare Available, Taken & Marketplace Domains",
        "subtitle": "1-click registration for available names, ICANN/Archive for taken domains & secondary market prices ($)",
        "out": "screenshot-4-aftermarket-pricing.jpg"
    },
    {
        "config": {
            "currentMode": "ai",
            "preferredTlds": ["com", "io", "ai"],
            "lastResults": SAMPLE_RESULTS,
            "starredDomains": ["agentflow.ai", "synapsetask.io", "agentflow.com", "autocortex.com"],
            "currentFilter": "starred"
        },
        "window_height": 640,
        "tag": "PRODUCTIVITY SUITE",
        "title": "Starred Shortlists, Aftermarket Pricing & Reports",
        "subtitle": "Bookmark favorites, discover secondary market prices ($), and export clean text reports",
        "out": "screenshot-5-favorites-export.jpg"
    }
]

def generate_screenshots():
    W, H = 1280, 800
    font_tag = get_font(13, bold=True)
    font_title = get_font(28, bold=True)
    font_sub = get_font(15, bold=False)
    
    with tempfile.TemporaryDirectory() as tmpdir:
        for idx, item in enumerate(SCREENSHOTS):
            print(f"[{idx+1}/5] Generating {item['title']} from REAL extension UI...")
            raw_png = os.path.join(tmpdir, f"real_shot_{idx}.png")
            render_real_popup_state(item["config"], raw_png, window_height=item["window_height"])
            
            # Background
            bg = create_gradient_bg(
                W, H,
                top_color=(8, 12, 22),
                bot_color=(15, 23, 42),
                glow_center=(W // 2, 230, 480),
                glow_color=(99, 102, 241, 55)
            )
            draw = ImageDraw.Draw(bg)
            
            # Tag badge pill
            tag_text = item["tag"]
            title_text = item["title"]
            sub_text = item["subtitle"]
            
            tag_w = int(draw.textlength(tag_text, font=font_tag))
            pill_pad_x, pill_pad_y = 14, 5
            pill_w = tag_w + pill_pad_x * 2
            pill_h = 24
            pill_x = (W - pill_w) // 2
            pill_y = 36
            
            draw.rounded_rectangle(
                [pill_x, pill_y, pill_x + pill_w, pill_y + pill_h],
                radius=12,
                fill=(49, 46, 129, 255),
                outline=(99, 102, 241, 255),
                width=1
            )
            draw.text((pill_x + pill_pad_x, pill_y + 4), tag_text, fill=(199, 210, 254), font=font_tag)
            
            # Title
            title_w = int(draw.textlength(title_text, font=font_title))
            title_x = (W - title_w) // 2
            title_y = pill_y + pill_h + 10
            draw.text((title_x, title_y), title_text, fill=(255, 255, 255), font=font_title)
            
            # Subtitle
            sub_w = int(draw.textlength(sub_text, font=font_sub))
            sub_x = (W - sub_w) // 2
            sub_y = title_y + 38
            draw.text((sub_x, sub_y), sub_text, fill=(148, 163, 184), font=font_sub)
            
            # Popup Mockup
            src_img = Image.open(raw_png)
            target_h = 570
            aspect = src_img.width / float(src_img.height)
            target_w = int(target_h * aspect)
            
            resized_img = src_img.resize((target_w, target_h), Image.LANCZOS)
            mockup_img, pad = round_corners_and_shadow(
                resized_img,
                radius=14,
                border_color=(99, 102, 241, 160),
                border_width=1,
                shadow_offset=16,
                shadow_blur=24
            )
            
            mockup_x = (W - target_w) // 2 - pad
            mockup_y = sub_y + 30 - pad
            
            bg_rgba = bg.convert("RGBA")
            bg_rgba.paste(mockup_img, (mockup_x, mockup_y), mask=mockup_img)
            
            final_jpg = bg_rgba.convert("RGB")
            out_path = os.path.join(STORE_ASSETS_DIR, item["out"])
            final_jpg.save(out_path, "JPEG", quality=95)
            print(f"✓ Saved -> {out_path}")

def generate_small_promo():
    W, H = 440, 280
    print("\nGenerating Small Promo Tile (440x280)...")
    
    bg = create_gradient_bg(
        W, H,
        top_color=(10, 14, 26),
        bot_color=(20, 27, 45),
        glow_center=(W // 2, 95, 180),
        glow_color=(124, 58, 237, 80)
    )
    
    icon = Image.open(ICON_PATH).convert("RGBA").resize((70, 70), Image.LANCZOS)
    icon_x = (W - 70) // 2
    icon_y = 26
    
    icon_glow = Image.new("RGBA", (100, 100), (0, 0, 0, 0))
    ig_draw = ImageDraw.Draw(icon_glow)
    ig_draw.ellipse([10, 10, 90, 90], fill=(139, 92, 246, 120))
    icon_glow = icon_glow.filter(ImageFilter.GaussianBlur(16))
    
    bg_rgba = bg.convert("RGBA")
    bg_rgba.paste(icon_glow, (icon_x - 15, icon_y - 15), mask=icon_glow)
    bg_rgba.paste(icon, (icon_x, icon_y), mask=icon)
    draw = ImageDraw.Draw(bg_rgba)
    
    font_title = get_font(23, bold=True)
    title = "Domain Scout AI"
    tw = int(draw.textlength(title, font=font_title))
    draw.text(((W - tw) // 2, icon_y + 80), title, fill=(255, 255, 255), font=font_title)
    
    font_sub = get_font(12, bold=False)
    sub = "AI Domain Ideator & Bulk Availability Checker"
    sw = int(draw.textlength(sub, font=font_sub))
    draw.text(((W - sw) // 2, icon_y + 114), sub, fill=(199, 210, 254), font=font_sub)
    
    font_pill = get_font(11, bold=True)
    pills = ["✨ AI SCOUT MODE", "🧠 MULTI-MODEL AI", "🔒 ZERO TRACKING"]
    total_pill_w = 0
    pill_widths = []
    for p in pills:
        pw = int(draw.textlength(p, font=font_pill)) + 16
        pill_widths.append(pw)
        total_pill_w += pw + 8
    total_pill_w -= 8
    
    start_x = (W - total_pill_w) // 2
    py = icon_y + 152
    for idx, p in enumerate(pills):
        pw = pill_widths[idx]
        draw.rounded_rectangle([start_x, py, start_x + pw, py + 24], radius=12, fill=(30, 27, 75, 220), outline=(99, 102, 241, 180), width=1)
        tw = int(draw.textlength(p, font=font_pill))
        draw.text((start_x + (pw - tw) // 2, py + 5), p, fill=(224, 231, 255), font=font_pill)
        start_x += pw + 8
        
    final_rgb = bg_rgba.convert("RGB")
    png_out = os.path.join(STORE_ASSETS_DIR, "promo-small-440x280.png")
    jpg_out = os.path.join(STORE_ASSETS_DIR, "promo-small-440x280.jpg")
    final_rgb.save(png_out, "PNG")
    final_rgb.save(jpg_out, "JPEG", quality=95)
    print(f"✓ Saved -> {png_out} & {jpg_out}")

def generate_marquee_promo():
    W, H = 1400, 560
    print("\nGenerating Marquee Promo Banner (1400x560)...")
    
    bg = create_gradient_bg(
        W, H,
        top_color=(8, 12, 24),
        bot_color=(15, 23, 42),
        glow_center=(420, 280, 520),
        glow_color=(124, 58, 237, 75)
    )
    bg_rgba = bg.convert("RGBA")
    draw = ImageDraw.Draw(bg_rgba)
    
    left_x = 90
    
    icon = Image.open(ICON_PATH).convert("RGBA").resize((64, 64), Image.LANCZOS)
    bg_rgba.paste(icon, (left_x, 75), mask=icon)
    
    font_brand = get_font(32, bold=True)
    draw.text((left_x + 80, 85), "Domain Scout AI", fill=(255, 255, 255), font=font_brand)
    
    font_head = get_font(34, bold=True)
    draw.text((left_x, 160), "AI-Powered Domain Ideator", fill=(248, 250, 252), font=font_head)
    draw.text((left_x, 204), "& Bulk Availability Checker", fill=(165, 180, 252), font=font_head)
    
    font_desc = get_font(15, bold=False)
    draw.text((left_x, 260), "Describe your startup concept and let AI auto-hunt 10 available domains.", fill=(148, 163, 184), font=font_desc)
    draw.text((left_x, 285), "Compare registrars, discover aftermarket prices, and export in 1 click.", fill=(148, 163, 184), font=font_desc)
    
    bullets = [
        "Autonomous AI Reiteration Loop (Finds 10 Available Domains)",
        "OpenRouter, OpenAI, Gemini, Groq & Offline Smart Brain",
        "1-Click Registrar Purchase (GoDaddy, Spaceship, Namecheap)",
        "100% Client-Side Privacy (Zero Tracking & Direct API Calls)"
    ]
    by = 340
    font_bullet = get_font(14, bold=False)
    for b in bullets:
        draw.ellipse([left_x, by, left_x + 18, by + 18], fill=(30, 27, 75), outline=(99, 102, 241), width=1)
        draw.line([(left_x + 4, by + 9), (left_x + 7, by + 12)], fill=(165, 180, 252), width=2)
        draw.line([(left_x + 7, by + 12), (left_x + 13, by + 5)], fill=(165, 180, 252), width=2)
        draw.text((left_x + 28, by + 1), b, fill=(241, 245, 249), font=font_bullet)
        by += 32
        
    with tempfile.TemporaryDirectory() as tmpdir:
        raw_mock = os.path.join(tmpdir, "mockup_ai.png")
        render_real_popup_state(SCREENSHOTS[1]["config"], raw_mock, window_height=640)
        mock_src = Image.open(raw_mock)
        mock_h = 490
        aspect = mock_src.width / float(mock_src.height)
        mock_w = int(mock_h * aspect)
        
        resized_mock = mock_src.resize((mock_w, mock_h), Image.LANCZOS)
        mockup_img, pad = round_corners_and_shadow(
            resized_mock,
            radius=14,
            border_color=(99, 102, 241, 200),
            border_width=1,
            shadow_offset=18,
            shadow_blur=28
        )
        
        mockup_x = W - mock_w - 90 - pad
        mockup_y = (H - mock_h) // 2 - pad + 10
        bg_rgba.paste(mockup_img, (mockup_x, mockup_y), mask=mockup_img)
        
    final_rgb = bg_rgba.convert("RGB")
    png_out = os.path.join(STORE_ASSETS_DIR, "promo-marquee-1400x560.png")
    jpg_out = os.path.join(STORE_ASSETS_DIR, "promo-marquee-1400x560.jpg")
    final_rgb.save(png_out, "PNG")
    final_rgb.save(jpg_out, "JPEG", quality=95)
    print(f"✓ Saved -> {png_out} & {jpg_out}")

if __name__ == "__main__":
    generate_screenshots()
    generate_small_promo()
    generate_marquee_promo()
    print("\n🎉 All store assets and real screenshots generated successfully!")
