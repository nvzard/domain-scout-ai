#!/usr/bin/env python3
import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ASSETS_DIR = "/Users/nitanshu/workspace/scripts/domain-checker-extension/store-assets"
ICON_PATH = "/Users/nitanshu/workspace/scripts/domain-checker-extension/src/icons/icon-128.png"

USER_SCREENSHOTS = [
    {
        "path": "/Users/nitanshu/.gemini/antigravity-ide/brain/6800ad2c-5663-47e3-91cd-4ef90d8444a4/.user_uploaded/media_1787507626003.png",
        "tag": "BULK SEARCH & TLDs",
        "title": "Lightning-Fast Bulk Domain Search",
        "subtitle": "Paste newlines, commas, or raw notes — check availability across .com, .io, .ai & more",
        "out": "screenshot-1-search-input.jpg"
    },
    {
        "path": "/Users/nitanshu/.gemini/antigravity-ide/brain/6800ad2c-5663-47e3-91cd-4ef90d8444a4/.user_uploaded/media_1787507626020.png",
        "tag": "REAL-TIME DASHBOARD",
        "title": "Instant Results & Availability Stats",
        "subtitle": "Clear breakdown of Available, Registered, and For Sale domains in seconds",
        "out": "screenshot-2-results-overview.jpg"
    },
    {
        "path": "/Users/nitanshu/.gemini/antigravity-ide/brain/6800ad2c-5663-47e3-91cd-4ef90d8444a4/.user_uploaded/media_1787507626089.png",
        "tag": "1-CLICK REGISTRARS",
        "title": "Instant Registrar Comparison & Purchase",
        "subtitle": "Jump directly into GoDaddy, Hostinger, Spaceship, Domain.com, or Namecheap",
        "out": "screenshot-3-registrars-continue.jpg"
    },
    {
        "path": "/Users/nitanshu/.gemini/antigravity-ide/brain/6800ad2c-5663-47e3-91cd-4ef90d8444a4/.user_uploaded/media_1787507626073.png",
        "tag": "AFTERMARKET INSIGHTS",
        "title": "Secondary Market & 'For Sale' Pricing",
        "subtitle": "Discover listed domain prices with direct 'Buy / Offer' links on Afternic, Sedo & Dan",
        "out": "screenshot-4-aftermarket-pricing.jpg"
    },
    {
        "path": "/Users/nitanshu/.gemini/antigravity-ide/brain/6800ad2c-5663-47e3-91cd-4ef90d8444a4/.user_uploaded/media_1787507626052.png",
        "tag": "PRODUCTIVITY SUITE",
        "title": "Starred Shortlists, WHOIS & Quick Export",
        "subtitle": "Bookmark favorites, inspect domain history, and copy or export clean reports",
        "out": "screenshot-5-favorites-export.jpg"
    }
]

def get_font(size, bold=False):
    # Try system fonts
    font_paths = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/HelveticaNeue.ttc",
        "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/SFProDisplay-Bold.otf" if bold else "/System/Library/Fonts/SFProDisplay-Regular.otf"
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
    
    # Linear vertical gradient
    for y in range(height):
        t = y / float(height)
        r = int(top_color[0] * (1 - t) + bot_color[0] * t)
        g = int(top_color[1] * (1 - t) + bot_color[1] * t)
        b = int(top_color[2] * (1 - t) + bot_color[2] * t)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
        
    # Radial glow layer
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

def round_corners_and_shadow(img, radius=20, border_color=(79, 70, 229, 200), border_width=2, shadow_offset=18, shadow_blur=30):
    # Ensure source is RGBA
    img = img.convert("RGBA")
    w, h = img.size
    
    # Rounded mask for the image
    mask = Image.new("L", (w, h), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, w, h], radius=radius, fill=255)
    
    # Border
    img_with_mask = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    img_with_mask.paste(img, (0, 0), mask=mask)
    
    border_draw = ImageDraw.Draw(img_with_mask)
    border_draw.rounded_rectangle([0, 0, w - 1, h - 1], radius=radius, outline=border_color, width=border_width)
    
    # Shadow canvas
    pad = shadow_blur * 2
    sw = w + pad * 2
    sh = h + pad * 2 + shadow_offset
    shadow_img = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_img)
    
    # Draw soft black shadow
    sdraw.rounded_rectangle([pad, pad + shadow_offset, pad + w, pad + shadow_offset + h], radius=radius, fill=(0, 0, 0, 180))
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(shadow_blur))
    
    # Paste actual image over shadow
    shadow_img.paste(img_with_mask, (pad, pad), mask=img_with_mask)
    return shadow_img, pad

def generate_screenshots():
    W, H = 1280, 800
    
    font_tag = get_font(13, bold=True)
    font_title = get_font(30, bold=True)
    font_sub = get_font(16, bold=False)
    
    for idx, item in enumerate(USER_SCREENSHOTS):
        print(f"Generating Screenshot {idx+1}: {item['title']}...")
        
        # 1. Background
        bg = create_gradient_bg(
            W, H, 
            top_color=(8, 12, 22), 
            bot_color=(15, 23, 42), 
            glow_center=(W // 2, 240, 480),
            glow_color=(99, 102, 241, 55)
        )
        draw = ImageDraw.Draw(bg)
        
        # 2. Top Header Text
        tag_text = item["tag"]
        title_text = item["title"]
        sub_text = item["subtitle"]
        
        # Tag badge pill
        tag_w = int(draw.textlength(tag_text, font=font_tag))
        pill_pad_x, pill_pad_y = 14, 5
        pill_w = tag_w + pill_pad_x * 2
        pill_h = 24
        pill_x = (W - pill_w) // 2
        pill_y = 38
        
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
        title_y = pill_y + pill_h + 12
        draw.text((title_x, title_y), title_text, fill=(255, 255, 255), font=font_title)
        
        # Subtitle
        sub_w = int(draw.textlength(sub_text, font=font_sub))
        sub_x = (W - sub_w) // 2
        sub_y = title_y + 42
        draw.text((sub_x, sub_y), sub_text, fill=(148, 163, 184), font=font_sub)
        
        # 3. Load & Process Screenshot Mockup
        src_img = Image.open(item["path"])
        # Target scale height ~ 590px for 800px total canvas
        target_h = 580
        aspect = src_img.width / float(src_img.height)
        target_w = int(target_h * aspect)
        
        resized_img = src_img.resize((target_w, target_h), Image.LANCZOS)
        mockup_img, pad = round_corners_and_shadow(
            resized_img, 
            radius=16, 
            border_color=(79, 70, 229, 160), 
            border_width=1, 
            shadow_offset=16, 
            shadow_blur=24
        )
        
        # Center the mockup horizontally
        mockup_x = (W - target_w) // 2 - pad
        mockup_y = sub_y + 36 - pad
        
        # Convert bg to RGBA to composite
        bg_rgba = bg.convert("RGBA")
        bg_rgba.paste(mockup_img, (mockup_x, mockup_y), mask=mockup_img)
        
        final_jpg = bg_rgba.convert("RGB")
        out_path = os.path.join(ASSETS_DIR, item["out"])
        final_jpg.save(out_path, "JPEG", quality=95)
        print(f"✓ Saved -> {out_path}")

def generate_small_promo():
    W, H = 440, 280
    print("Generating Small Promo Tile (440x280)...")
    
    bg = create_gradient_bg(
        W, H,
        top_color=(10, 14, 26),
        bot_color=(20, 27, 45),
        glow_center=(W // 2, 100, 180),
        glow_color=(124, 58, 237, 75)
    )
    draw = ImageDraw.Draw(bg)
    
    # 1. App Icon
    icon = Image.open(ICON_PATH).convert("RGBA").resize((72, 72), Image.LANCZOS)
    icon_x = (W - 72) // 2
    icon_y = 28
    
    # Icon soft glow
    icon_glow = Image.new("RGBA", (100, 100), (0, 0, 0, 0))
    ig_draw = ImageDraw.Draw(icon_glow)
    ig_draw.ellipse([10, 10, 90, 90], fill=(139, 92, 246, 120))
    icon_glow = icon_glow.filter(ImageFilter.GaussianBlur(16))
    
    bg_rgba = bg.convert("RGBA")
    bg_rgba.paste(icon_glow, (icon_x - 14, icon_y - 14), mask=icon_glow)
    bg_rgba.paste(icon, (icon_x, icon_y), mask=icon)
    draw = ImageDraw.Draw(bg_rgba)
    
    # 2. App Title
    font_title = get_font(24, bold=True)
    title = "Domain Scout"
    tw = int(draw.textlength(title, font=font_title))
    draw.text(((W - tw) // 2, icon_y + 82), title, fill=(255, 255, 255), font=font_title)
    
    # 3. Subtitle / Tagline
    font_sub = get_font(13, bold=False)
    sub = "Fast Bulk Domain Search & Registrar Checker"
    sw = int(draw.textlength(sub, font=font_sub))
    draw.text(((W - sw) // 2, icon_y + 116), sub, fill=(199, 210, 254), font=font_sub)
    
    # 4. Feature Pills row
    font_pill = get_font(11, bold=True)
    pills = [".COM / .IO / .AI", "REGISTRAR LINKS", "ZERO TRACKING"]
    total_pill_w = 0
    pill_widths = []
    for p in pills:
        pw = int(draw.textlength(p, font=font_pill)) + 18
        pill_widths.append(pw)
        total_pill_w += pw + 8
    total_pill_w -= 8
    
    start_x = (W - total_pill_w) // 2
    py = icon_y + 154
    for idx, p in enumerate(pills):
        pw = pill_widths[idx]
        draw.rounded_rectangle([start_x, py, start_x + pw, py + 22], radius=11, fill=(30, 27, 75, 200), outline=(99, 102, 241, 180), width=1)
        tw = int(draw.textlength(p, font=font_pill))
        draw.text((start_x + (pw - tw) // 2, py + 4), p, fill=(224, 231, 255), font=font_pill)
        start_x += pw + 8
        
    final_rgb = bg_rgba.convert("RGB")
    png_out = os.path.join(ASSETS_DIR, "promo-small-440x280.png")
    jpg_out = os.path.join(ASSETS_DIR, "promo-small-440x280.jpg")
    final_rgb.save(png_out, "PNG")
    final_rgb.save(jpg_out, "JPEG", quality=95)
    print(f"✓ Saved -> {png_out} & {jpg_out}")

def generate_marquee_promo():
    W, H = 1400, 560
    print("Generating Marquee Promo Tile (1400x560)...")
    
    bg = create_gradient_bg(
        W, H,
        top_color=(8, 12, 24),
        bot_color=(15, 23, 42),
        glow_center=(400, 280, 500),
        glow_color=(124, 58, 237, 70)
    )
    bg_rgba = bg.convert("RGBA")
    draw = ImageDraw.Draw(bg_rgba)
    
    # 1. Left Side Branding
    left_x = 90
    
    # App Icon + Title row
    icon = Image.open(ICON_PATH).convert("RGBA").resize((64, 64), Image.LANCZOS)
    bg_rgba.paste(icon, (left_x, 75), mask=icon)
    
    font_brand = get_font(32, bold=True)
    draw.text((left_x + 80, 85), "Domain Scout", fill=(255, 255, 255), font=font_brand)
    
    # Main Headline
    font_head = get_font(34, bold=True)
    draw.text((left_x, 160), "Instant Bulk Domain Search", fill=(248, 250, 252), font=font_head)
    draw.text((left_x, 204), "& Registrar Comparison", fill=(165, 180, 252), font=font_head)
    
    # Subtitle
    font_desc = get_font(16, bold=False)
    draw.text((left_x, 260), "Check dozens of names simultaneously across top TLDs.", fill=(148, 163, 184), font=font_desc)
    draw.text((left_x, 285), "Find availability, aftermarket prices, and compare registrars in 1 click.", fill=(148, 163, 184), font=font_desc)
    
    # Feature Bullet Badges
    font_bullet = get_font(14, bold=False)
    bullets = [
        "Real-Time .com / .io / .ai Bulk Availability",
        "Direct GoDaddy, Namecheap & Spaceship Links",
        "Smart Prefix & Suffix Variations Generator",
        "100% Client-Side Privacy (Zero Tracking)"
    ]
    by = 345
    font_check = get_font(11, bold=True)
    for b in bullets:
        # Draw clean check icon
        draw.ellipse([left_x, by, left_x + 18, by + 18], fill=(30, 27, 75), outline=(99, 102, 241), width=1)
        # Geometric checkmark
        draw.line([(left_x + 4, by + 9), (left_x + 7, by + 12)], fill=(165, 180, 252), width=2)
        draw.line([(left_x + 7, by + 12), (left_x + 13, by + 5)], fill=(165, 180, 252), width=2)
        draw.text((left_x + 28, by + 1), b, fill=(241, 245, 249), font=font_bullet)
        by += 32
        
    # 2. Right Side Popup Mockup
    # Load screenshot 3 (Registrars open)
    mock_src = Image.open(USER_SCREENSHOTS[2]["path"])
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
    png_out = os.path.join(ASSETS_DIR, "promo-marquee-1400x560.png")
    jpg_out = os.path.join(ASSETS_DIR, "promo-marquee-1400x560.jpg")
    final_rgb.save(png_out, "PNG")
    final_rgb.save(jpg_out, "JPEG", quality=95)
    print(f"✓ Saved -> {png_out} & {jpg_out}")

if __name__ == "__main__":
    generate_screenshots()
    generate_small_promo()
    generate_marquee_promo()
    print("\n✨ All store assets generated successfully!")
