#!/usr/bin/env python3
"""
KotobaQuest Pixel Art Sprite Generator
Generates 8-bit pixel art sprites procedurally using PIL.
All sprites are 32x32 pixels, scaled up via CSS in the game.
Style: Classic NES/Famicom 8-bit RPG sprites with limited palette.
"""

from PIL import Image, ImageDraw
import os
import json

OUTPUT_DIR = "/home/z/my-project/public/sprites"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 8-bit NES-style palette
PALETTE = {
    "transparent": (0, 0, 0, 0),
    "black": (26, 26, 46, 255),
    "white": (245, 241, 232, 255),
    "cream": (232, 224, 200, 255),
    "shadow": (74, 58, 42, 255),
    "red": (239, 83, 80, 255),
    "dark_red": (183, 28, 28, 255),
    "orange": (255, 167, 38, 255),
    "yellow": (255, 213, 79, 255),
    "gold": (245, 127, 23, 255),
    "green": (76, 175, 80, 255),
    "dark_green": (46, 125, 50, 255),
    "lime": (170, 255, 90, 255),
    "blue": (79, 195, 247, 255),
    "dark_blue": (1, 87, 155, 255),
    "navy": (15, 52, 96, 255),
    "purple": (149, 117, 205, 255),
    "dark_purple": (69, 39, 160, 255),
    "pink": (244, 143, 177, 255),
    "brown": (141, 110, 99, 255),
    "dark_brown": (62, 39, 35, 255),
    "gray": (139, 139, 157, 255),
    "light_gray": (200, 200, 220, 255),
    "dark_gray": (60, 60, 80, 255),
    "skin": (255, 200, 160, 255),
    "hair_brown": (101, 67, 33, 255),
}

SPRITE_SIZE = 32

def new_sprite():
    return Image.new("RGBA", (SPRITE_SIZE, SPRITE_SIZE), PALETTE["transparent"])

def pixel(img, x, y, color):
    if 0 <= x < SPRITE_SIZE and 0 <= y < SPRITE_SIZE:
        img.putpixel((x, y), color)

def rect(img, x1, y1, x2, y2, color):
    for y in range(max(0, y1), min(SPRITE_SIZE, y2 + 1)):
        for x in range(max(0, x1), min(SPRITE_SIZE, x2 + 1)):
            img.putpixel((x, y), color)

def save_sprite(img, name, scale=8):
    scaled = img.resize((SPRITE_SIZE * scale, SPRITE_SIZE * scale), Image.NEAREST)
    path = os.path.join(OUTPUT_DIR, f"{name}.png")
    scaled.save(path, "PNG")
    print(f"  + {name}.png")
    return path

# ===== SPRITE DEFINITIONS =====

def sprite_hero():
    img = new_sprite()
    rect(img, 11, 4, 20, 7, PALETTE["hair_brown"])
    rect(img, 10, 5, 21, 8, PALETTE["hair_brown"])
    rect(img, 12, 8, 19, 13, PALETTE["skin"])
    pixel(img, 13, 10, PALETTE["black"]); pixel(img, 14, 10, PALETTE["black"])
    pixel(img, 17, 10, PALETTE["black"]); pixel(img, 18, 10, PALETTE["black"])
    rect(img, 14, 12, 17, 12, PALETTE["dark_red"])
    rect(img, 10, 14, 21, 22, PALETTE["blue"])
    rect(img, 11, 14, 20, 14, PALETTE["dark_blue"])
    rect(img, 10, 19, 21, 20, PALETTE["dark_blue"])
    pixel(img, 15, 16, PALETTE["yellow"]); pixel(img, 14, 17, PALETTE["yellow"])
    pixel(img, 16, 17, PALETTE["yellow"]); pixel(img, 15, 18, PALETTE["yellow"])
    rect(img, 8, 15, 9, 20, PALETTE["blue"]); rect(img, 22, 15, 23, 20, PALETTE["blue"])
    rect(img, 8, 21, 9, 22, PALETTE["skin"]); rect(img, 22, 21, 23, 22, PALETTE["skin"])
    rect(img, 24, 8, 25, 24, PALETTE["brown"])
    pixel(img, 24, 7, PALETTE["yellow"]); pixel(img, 25, 7, PALETTE["yellow"])
    pixel(img, 23, 8, PALETTE["yellow"]); pixel(img, 26, 8, PALETTE["yellow"])
    rect(img, 12, 23, 14, 27, PALETTE["dark_blue"]); rect(img, 17, 23, 19, 27, PALETTE["dark_blue"])
    rect(img, 12, 28, 14, 30, PALETTE["dark_brown"]); rect(img, 17, 28, 19, 30, PALETTE["dark_brown"])
    return img

def sprite_yuki():
    img = new_sprite()
    rect(img, 9, 5, 22, 18, PALETTE["gray"])
    rect(img, 12, 8, 19, 14, PALETTE["skin"])
    rect(img, 11, 6, 20, 8, PALETTE["gray"])
    rect(img, 12, 7, 19, 8, PALETTE["light_gray"])
    pixel(img, 13, 10, PALETTE["dark_blue"]); pixel(img, 14, 10, PALETTE["dark_blue"])
    pixel(img, 17, 10, PALETTE["dark_blue"]); pixel(img, 18, 10, PALETTE["dark_blue"])
    pixel(img, 15, 12, PALETTE["dark_red"]); pixel(img, 16, 12, PALETTE["dark_red"])
    rect(img, 11, 14, 20, 24, PALETTE["white"])
    rect(img, 11, 14, 20, 14, PALETTE["light_gray"])
    rect(img, 15, 15, 16, 24, PALETTE["light_gray"])
    rect(img, 9, 15, 10, 20, PALETTE["white"]); rect(img, 21, 15, 22, 20, PALETTE["white"])
    pixel(img, 9, 21, PALETTE["skin"]); pixel(img, 22, 21, PALETTE["skin"])
    rect(img, 9, 18, 10, 22, PALETTE["gray"]); rect(img, 21, 18, 22, 22, PALETTE["gray"])
    rect(img, 13, 25, 18, 28, PALETTE["white"])
    rect(img, 13, 29, 15, 30, PALETTE["light_gray"]); rect(img, 16, 29, 18, 30, PALETTE["light_gray"])
    return img

def sprite_slime():
    img = new_sprite()
    rect(img, 8, 12, 23, 22, PALETTE["green"])
    rect(img, 9, 10, 22, 12, PALETTE["green"])
    rect(img, 11, 9, 20, 10, PALETTE["green"])
    rect(img, 13, 8, 18, 9, PALETTE["green"])
    rect(img, 10, 11, 12, 13, PALETTE["lime"])
    pixel(img, 9, 12, PALETTE["lime"])
    rect(img, 8, 21, 23, 22, PALETTE["dark_green"])
    pixel(img, 13, 14, PALETTE["black"]); pixel(img, 14, 14, PALETTE["black"])
    pixel(img, 18, 14, PALETTE["black"]); pixel(img, 19, 14, PALETTE["black"])
    rect(img, 14, 17, 17, 17, PALETTE["black"])
    pixel(img, 13, 16, PALETTE["black"]); pixel(img, 18, 16, PALETTE["black"])
    rect(img, 7, 23, 24, 24, PALETTE["dark_green"])
    return img

def sprite_kappa():
    img = new_sprite()
    rect(img, 9, 11, 22, 22, PALETTE["purple"])
    rect(img, 11, 9, 20, 11, PALETTE["purple"])
    rect(img, 13, 8, 18, 9, PALETTE["purple"])
    rect(img, 13, 6, 18, 8, PALETTE["blue"])
    pixel(img, 14, 5, PALETTE["blue"]); pixel(img, 17, 5, PALETTE["blue"])
    rect(img, 14, 13, 17, 14, PALETTE["yellow"])
    pixel(img, 12, 11, PALETTE["black"]); pixel(img, 19, 11, PALETTE["black"])
    rect(img, 6, 14, 8, 18, PALETTE["purple"]); rect(img, 23, 14, 25, 18, PALETTE["purple"])
    rect(img, 5, 18, 8, 20, PALETTE["dark_purple"]); rect(img, 23, 18, 26, 20, PALETTE["dark_purple"])
    rect(img, 11, 22, 14, 25, PALETTE["dark_purple"]); rect(img, 17, 22, 20, 25, PALETTE["dark_purple"])
    rect(img, 10, 25, 15, 26, PALETTE["dark_purple"]); rect(img, 16, 25, 21, 26, PALETTE["dark_purple"])
    return img

def sprite_spirit():
    img = new_sprite()
    rect(img, 10, 6, 21, 20, PALETTE["blue"])
    rect(img, 11, 5, 20, 6, PALETTE["blue"])
    rect(img, 13, 4, 18, 5, PALETTE["blue"])
    rect(img, 10, 21, 12, 23, PALETTE["blue"]); rect(img, 14, 21, 17, 23, PALETTE["blue"]); rect(img, 19, 21, 21, 23, PALETTE["blue"])
    rect(img, 10, 23, 12, 24, PALETTE["dark_blue"]); rect(img, 14, 23, 17, 24, PALETTE["dark_blue"]); rect(img, 19, 23, 21, 24, PALETTE["dark_blue"])
    rect(img, 12, 7, 14, 9, PALETTE["white"])
    rect(img, 12, 11, 14, 13, PALETTE["white"]); rect(img, 17, 11, 19, 13, PALETTE["white"])
    pixel(img, 13, 12, PALETTE["black"]); pixel(img, 18, 12, PALETTE["black"])
    rect(img, 14, 15, 17, 17, PALETTE["dark_blue"])
    pixel(img, 15, 16, PALETTE["black"]); pixel(img, 16, 16, PALETTE["black"])
    return img

def sprite_troll():
    img = new_sprite()
    rect(img, 11, 4, 20, 11, PALETTE["green"])
    pixel(img, 10, 3, PALETTE["white"]); pixel(img, 21, 3, PALETTE["white"])
    pixel(img, 10, 4, PALETTE["white"]); pixel(img, 21, 4, PALETTE["white"])
    rect(img, 12, 7, 14, 8, PALETTE["black"]); rect(img, 17, 7, 19, 8, PALETTE["black"])
    pixel(img, 13, 7, PALETTE["red"]); pixel(img, 18, 7, PALETTE["red"])
    rect(img, 13, 9, 18, 10, PALETTE["dark_red"])
    pixel(img, 13, 10, PALETTE["white"]); pixel(img, 18, 10, PALETTE["white"])
    rect(img, 8, 12, 23, 24, PALETTE["green"]); rect(img, 8, 12, 23, 13, PALETTE["dark_green"])
    rect(img, 4, 13, 8, 22, PALETTE["green"]); rect(img, 23, 13, 27, 22, PALETTE["green"])
    rect(img, 3, 22, 8, 26, PALETTE["dark_green"]); rect(img, 23, 22, 28, 26, PALETTE["dark_green"])
    rect(img, 8, 19, 23, 20, PALETTE["dark_brown"])
    rect(img, 11, 25, 15, 30, PALETTE["green"]); rect(img, 16, 25, 20, 30, PALETTE["green"])
    rect(img, 10, 29, 16, 31, PALETTE["dark_brown"]); rect(img, 15, 29, 21, 31, PALETTE["dark_brown"])
    return img

def sprite_gardo():
    img = new_sprite()
    rect(img, 11, 3, 20, 10, PALETTE["gray"]); rect(img, 12, 4, 19, 9, PALETTE["light_gray"])
    rect(img, 12, 6, 19, 7, PALETTE["black"])
    pixel(img, 13, 6, PALETTE["red"]); pixel(img, 18, 6, PALETTE["red"])
    rect(img, 15, 1, 16, 3, PALETTE["red"])
    rect(img, 9, 11, 22, 22, PALETTE["gray"]); rect(img, 10, 12, 21, 21, PALETTE["light_gray"])
    rect(img, 13, 14, 18, 19, PALETTE["dark_blue"])
    pixel(img, 15, 15, PALETTE["yellow"]); pixel(img, 16, 15, PALETTE["yellow"])
    pixel(img, 15, 16, PALETTE["yellow"]); pixel(img, 16, 16, PALETTE["yellow"])
    rect(img, 6, 12, 9, 21, PALETTE["gray"]); rect(img, 22, 12, 25, 21, PALETTE["gray"])
    rect(img, 5, 21, 9, 23, PALETTE["dark_gray"]); rect(img, 22, 21, 26, 23, PALETTE["dark_gray"])
    rect(img, 2, 14, 5, 22, PALETTE["dark_blue"]); rect(img, 3, 15, 4, 21, PALETTE["yellow"])
    rect(img, 26, 6, 27, 22, PALETTE["light_gray"]); rect(img, 25, 22, 28, 23, PALETTE["gold"])
    rect(img, 26, 23, 27, 25, PALETTE["brown"])
    rect(img, 11, 23, 14, 28, PALETTE["gray"]); rect(img, 17, 23, 20, 28, PALETTE["gray"])
    rect(img, 10, 28, 15, 30, PALETTE["dark_gray"]); rect(img, 16, 28, 21, 30, PALETTE["dark_gray"])
    return img

def sprite_shadow_king():
    img = new_sprite()
    rect(img, 9, 1, 22, 3, PALETTE["dark_purple"])
    pixel(img, 10, 0, PALETTE["purple"]); pixel(img, 15, 0, PALETTE["purple"])
    pixel(img, 16, 0, PALETTE["purple"]); pixel(img, 21, 0, PALETTE["purple"])
    pixel(img, 12, 2, PALETTE["red"]); pixel(img, 19, 2, PALETTE["red"])
    rect(img, 10, 4, 21, 12, PALETTE["dark_purple"])
    rect(img, 12, 7, 14, 8, PALETTE["red"]); rect(img, 17, 7, 19, 8, PALETTE["red"])
    pixel(img, 13, 7, PALETTE["yellow"]); pixel(img, 18, 7, PALETTE["yellow"])
    rect(img, 13, 10, 18, 11, PALETTE["black"])
    pixel(img, 14, 11, PALETTE["white"]); pixel(img, 17, 11, PALETTE["white"])
    rect(img, 7, 13, 24, 26, PALETTE["dark_purple"]); rect(img, 8, 13, 23, 14, PALETTE["purple"])
    rect(img, 4, 13, 7, 28, PALETTE["dark_purple"]); rect(img, 24, 13, 27, 28, PALETTE["dark_purple"])
    rect(img, 5, 15, 8, 23, PALETTE["dark_purple"]); rect(img, 23, 15, 26, 23, PALETTE["dark_purple"])
    rect(img, 3, 22, 6, 25, PALETTE["black"]); rect(img, 25, 22, 28, 25, PALETTE["black"])
    pixel(img, 14, 17, PALETTE["purple"]); pixel(img, 17, 17, PALETTE["purple"])
    pixel(img, 15, 20, PALETTE["purple"]); pixel(img, 16, 20, PALETTE["purple"])
    rect(img, 10, 26, 14, 30, PALETTE["dark_purple"]); rect(img, 17, 26, 21, 30, PALETTE["dark_purple"])
    rect(img, 8, 29, 14, 31, PALETTE["black"]); rect(img, 17, 29, 23, 31, PALETTE["black"])
    return img

def sprite_mirror_phantom():
    img = new_sprite()
    rect(img, 8, 2, 23, 4, PALETTE["gold"]); rect(img, 8, 25, 23, 27, PALETTE["gold"])
    rect(img, 8, 2, 10, 27, PALETTE["gold"]); rect(img, 21, 2, 23, 27, PALETTE["gold"])
    pixel(img, 7, 1, PALETTE["gold"]); pixel(img, 24, 1, PALETTE["gold"])
    pixel(img, 7, 28, PALETTE["gold"]); pixel(img, 24, 28, PALETTE["gold"])
    rect(img, 11, 5, 20, 24, PALETTE["dark_purple"])
    rect(img, 13, 8, 18, 16, PALETTE["light_gray"])
    rect(img, 13, 10, 15, 11, PALETTE["yellow"]); rect(img, 16, 10, 18, 11, PALETTE["yellow"])
    pixel(img, 14, 10, PALETTE["red"]); pixel(img, 17, 10, PALETTE["red"])
    rect(img, 14, 13, 17, 14, PALETTE["black"])
    pixel(img, 15, 14, PALETTE["white"]); pixel(img, 16, 14, PALETTE["white"])
    rect(img, 12, 17, 19, 23, PALETTE["purple"])
    pixel(img, 14, 19, PALETTE["light_gray"]); pixel(img, 17, 19, PALETTE["light_gray"])
    pixel(img, 15, 21, PALETTE["light_gray"])
    pixel(img, 12, 7, PALETTE["white"]); pixel(img, 13, 8, PALETTE["white"])
    pixel(img, 19, 22, PALETTE["white"]); pixel(img, 18, 23, PALETTE["white"])
    return img

def sprite_book_spirit():
    img = new_sprite()
    rect(img, 8, 6, 23, 24, PALETTE["dark_brown"]); rect(img, 9, 7, 22, 23, PALETTE["brown"])
    rect(img, 8, 6, 23, 7, PALETTE["cream"]); rect(img, 8, 24, 23, 25, PALETTE["cream"])
    rect(img, 13, 11, 18, 14, PALETTE["yellow"]); rect(img, 14, 12, 17, 13, PALETTE["red"])
    pixel(img, 15, 12, PALETTE["black"]); pixel(img, 16, 12, PALETTE["black"])
    rect(img, 13, 17, 18, 19, PALETTE["black"])
    pixel(img, 14, 18, PALETTE["white"]); pixel(img, 16, 18, PALETTE["white"])
    pixel(img, 11, 9, PALETTE["gold"]); pixel(img, 20, 9, PALETTE["gold"])
    pixel(img, 11, 21, PALETTE["gold"]); pixel(img, 20, 21, PALETTE["gold"])
    pixel(img, 13, 26, PALETTE["purple"]); pixel(img, 18, 26, PALETTE["purple"])
    pixel(img, 15, 27, PALETTE["purple"]); pixel(img, 16, 27, PALETTE["purple"])
    return img

def sprite_kitsune():
    img = new_sprite()
    rect(img, 11, 2, 20, 4, PALETTE["orange"]); rect(img, 9, 4, 22, 8, PALETTE["orange"])
    rect(img, 8, 8, 23, 18, PALETTE["orange"])
    rect(img, 12, 4, 19, 6, PALETTE["yellow"]); rect(img, 11, 6, 20, 10, PALETTE["yellow"])
    rect(img, 12, 9, 19, 17, PALETTE["white"])
    pixel(img, 11, 7, PALETTE["white"]); pixel(img, 12, 8, PALETTE["white"])
    pixel(img, 19, 7, PALETTE["white"]); pixel(img, 20, 8, PALETTE["white"])
    rect(img, 13, 11, 14, 12, PALETTE["red"]); rect(img, 17, 11, 18, 12, PALETTE["red"])
    pixel(img, 13, 11, PALETTE["yellow"]); pixel(img, 17, 11, PALETTE["yellow"])
    pixel(img, 15, 13, PALETTE["black"]); pixel(img, 16, 13, PALETTE["black"])
    pixel(img, 15, 15, PALETTE["black"]); pixel(img, 16, 15, PALETTE["black"])
    rect(img, 9, 18, 11, 22, PALETTE["orange"]); rect(img, 14, 19, 17, 23, PALETTE["orange"])
    rect(img, 20, 18, 22, 22, PALETTE["orange"])
    pixel(img, 10, 22, PALETTE["yellow"]); pixel(img, 15, 23, PALETTE["yellow"]); pixel(img, 21, 22, PALETTE["yellow"])
    return img

def sprite_rokku():
    img = new_sprite()
    rect(img, 11, 1, 20, 3, PALETTE["gold"]); rect(img, 12, 0, 19, 1, PALETTE["gold"])
    pixel(img, 15, 0, PALETTE["yellow"]); pixel(img, 16, 0, PALETTE["yellow"])
    rect(img, 11, 4, 20, 10, PALETTE["skin"])
    rect(img, 11, 9, 20, 18, PALETTE["white"]); rect(img, 12, 18, 19, 20, PALETTE["white"])
    pixel(img, 13, 19, PALETTE["white"]); pixel(img, 18, 19, PALETTE["white"])
    pixel(img, 13, 6, PALETTE["black"]); pixel(img, 18, 6, PALETTE["black"])
    rect(img, 15, 7, 16, 9, PALETTE["skin"]); pixel(img, 15, 8, PALETTE["shadow"]); pixel(img, 16, 8, PALETTE["shadow"])
    rect(img, 12, 9, 14, 10, PALETTE["white"]); rect(img, 17, 9, 19, 10, PALETTE["white"])
    rect(img, 9, 18, 22, 28, PALETTE["gold"])
    rect(img, 13, 21, 18, 26, PALETTE["white"])
    pixel(img, 15, 21, PALETTE["black"]); pixel(img, 16, 21, PALETTE["black"])
    pixel(img, 15, 25, PALETTE["black"]); pixel(img, 16, 25, PALETTE["black"])
    pixel(img, 13, 23, PALETTE["black"]); pixel(img, 18, 23, PALETTE["black"])
    rect(img, 15, 23, 16, 24, PALETTE["black"]); pixel(img, 16, 22, PALETTE["black"])
    rect(img, 6, 19, 9, 25, PALETTE["gold"]); rect(img, 22, 19, 25, 25, PALETTE["gold"])
    pixel(img, 6, 25, PALETTE["skin"]); pixel(img, 25, 25, PALETTE["skin"])
    rect(img, 12, 28, 14, 30, PALETTE["dark_brown"]); rect(img, 17, 28, 19, 30, PALETTE["dark_brown"])
    return img

def sprite_kanji_book():
    img = new_sprite()
    rect(img, 6, 8, 25, 22, PALETTE["dark_blue"]); rect(img, 7, 9, 24, 21, PALETTE["cream"])
    rect(img, 15, 8, 16, 22, PALETTE["dark_brown"])
    rect(img, 9, 14, 13, 15, PALETTE["black"])
    pixel(img, 19, 12, PALETTE["black"]); rect(img, 18, 13, 20, 13, PALETTE["black"])
    rect(img, 18, 14, 22, 14, PALETTE["black"]); pixel(img, 21, 13, PALETTE["black"])
    pixel(img, 19, 15, PALETTE["black"]); pixel(img, 21, 15, PALETTE["black"])
    rect(img, 2, 11, 6, 14, PALETTE["white"]); rect(img, 25, 11, 29, 14, PALETTE["white"])
    pixel(img, 3, 12, PALETTE["white"]); pixel(img, 28, 12, PALETTE["white"])
    rect(img, 15, 10, 16, 11, PALETTE["yellow"])
    pixel(img, 15, 10, PALETTE["black"]); pixel(img, 16, 10, PALETTE["black"])
    pixel(img, 4, 6, PALETTE["yellow"]); pixel(img, 27, 6, PALETTE["yellow"])
    pixel(img, 4, 24, PALETTE["yellow"]); pixel(img, 27, 24, PALETTE["yellow"])
    return img

def sprite_lord_vassal():
    img = new_sprite()
    rect(img, 11, 1, 20, 3, PALETTE["gold"])
    pixel(img, 11, 0, PALETTE["gold"]); pixel(img, 15, 0, PALETTE["gold"])
    pixel(img, 16, 0, PALETTE["gold"]); pixel(img, 20, 0, PALETTE["gold"])
    pixel(img, 13, 2, PALETTE["red"]); pixel(img, 15, 1, PALETTE["blue"])
    pixel(img, 16, 1, PALETTE["blue"]); pixel(img, 18, 2, PALETTE["red"])
    rect(img, 11, 4, 20, 11, PALETTE["skin"])
    pixel(img, 13, 7, PALETTE["black"]); pixel(img, 14, 7, PALETTE["black"])
    pixel(img, 17, 7, PALETTE["black"]); pixel(img, 18, 7, PALETTE["black"])
    rect(img, 12, 10, 19, 15, PALETTE["white"]); rect(img, 13, 15, 18, 16, PALETTE["white"])
    pixel(img, 14, 16, PALETTE["white"]); pixel(img, 17, 16, PALETTE["white"])
    rect(img, 12, 9, 14, 10, PALETTE["white"]); rect(img, 17, 9, 19, 10, PALETTE["white"])
    rect(img, 8, 14, 23, 27, PALETTE["dark_purple"]); rect(img, 9, 14, 22, 15, PALETTE["gold"])
    rect(img, 14, 18, 17, 21, PALETTE["gold"])
    pixel(img, 15, 18, PALETTE["yellow"]); pixel(img, 16, 18, PALETTE["yellow"])
    pixel(img, 15, 21, PALETTE["yellow"]); pixel(img, 16, 21, PALETTE["yellow"])
    rect(img, 5, 14, 8, 28, PALETTE["red"]); rect(img, 23, 14, 26, 28, PALETTE["red"])
    rect(img, 6, 15, 8, 22, PALETTE["dark_purple"]); rect(img, 23, 15, 25, 22, PALETTE["dark_purple"])
    pixel(img, 6, 22, PALETTE["skin"]); pixel(img, 25, 22, PALETTE["skin"])
    pixel(img, 6, 21, PALETTE["gold"]); pixel(img, 25, 21, PALETTE["gold"])
    rect(img, 26, 8, 27, 22, PALETTE["gold"])
    pixel(img, 26, 7, PALETTE["red"]); pixel(img, 27, 7, PALETTE["red"])
    pixel(img, 26, 6, PALETTE["yellow"])
    rect(img, 11, 27, 20, 30, PALETTE["dark_purple"])
    rect(img, 11, 30, 14, 31, PALETTE["black"]); rect(img, 17, 30, 20, 31, PALETTE["black"])
    return img

def sprite_k_beast():
    img = new_sprite()
    rect(img, 8, 12, 23, 22, PALETTE["gray"]); rect(img, 18, 8, 26, 16, PALETTE["gray"])
    pixel(img, 19, 6, PALETTE["gray"]); pixel(img, 20, 7, PALETTE["gray"])
    pixel(img, 24, 6, PALETTE["gray"]); pixel(img, 25, 7, PALETTE["gray"])
    rect(img, 24, 13, 27, 15, PALETTE["dark_gray"]); pixel(img, 27, 14, PALETTE["black"])
    rect(img, 21, 11, 23, 12, PALETTE["red"]); pixel(img, 22, 11, PALETTE["black"])
    pixel(img, 25, 15, PALETTE["white"]); pixel(img, 26, 15, PALETTE["white"])
    rect(img, 9, 22, 12, 27, PALETTE["dark_gray"]); rect(img, 14, 22, 17, 27, PALETTE["dark_gray"])
    rect(img, 19, 22, 22, 27, PALETTE["dark_gray"])
    rect(img, 5, 14, 8, 18, PALETTE["gray"]); pixel(img, 4, 13, PALETTE["gray"]); pixel(img, 4, 17, PALETTE["gray"])
    pixel(img, 9, 27, PALETTE["white"]); pixel(img, 11, 27, PALETTE["white"])
    pixel(img, 14, 27, PALETTE["white"]); pixel(img, 16, 27, PALETTE["white"])
    pixel(img, 19, 27, PALETTE["white"]); pixel(img, 21, 27, PALETTE["white"])
    return img

def sprite_stone_trio():
    img = new_sprite()
    # Left small
    rect(img, 3, 14, 9, 24, PALETTE["gray"]); rect(img, 4, 11, 8, 14, PALETTE["gray"])
    pixel(img, 5, 12, PALETTE["black"]); pixel(img, 7, 12, PALETTE["black"])
    rect(img, 4, 18, 8, 19, PALETTE["dark_gray"])
    # Center big
    rect(img, 12, 10, 19, 25, PALETTE["gray"]); rect(img, 13, 6, 18, 10, PALETTE["gray"])
    rect(img, 14, 8, 17, 9, PALETTE["black"])
    pixel(img, 14, 8, PALETTE["red"]); pixel(img, 17, 8, PALETTE["red"])
    rect(img, 14, 14, 17, 15, PALETTE["dark_gray"])
    pixel(img, 15, 18, PALETTE["dark_gray"]); pixel(img, 16, 19, PALETTE["dark_gray"])
    # Right small
    rect(img, 22, 14, 28, 24, PALETTE["gray"]); rect(img, 23, 11, 27, 14, PALETTE["gray"])
    pixel(img, 24, 12, PALETTE["black"]); pixel(img, 26, 12, PALETTE["black"])
    rect(img, 23, 18, 27, 19, PALETTE["dark_gray"])
    rect(img, 3, 25, 28, 26, PALETTE["dark_gray"])
    return img

def sprite_mirror_horde():
    img = new_sprite()
    # Main center mirror
    rect(img, 11, 6, 20, 22, PALETTE["light_gray"]); rect(img, 12, 7, 19, 21, PALETTE["white"])
    rect(img, 13, 10, 18, 13, PALETTE["dark_purple"])
    pixel(img, 14, 11, PALETTE["red"]); pixel(img, 17, 11, PALETTE["red"])
    rect(img, 14, 16, 17, 18, PALETTE["black"])
    # Top-left small
    rect(img, 3, 3, 8, 8, PALETTE["light_gray"]); rect(img, 4, 4, 7, 7, PALETTE["white"])
    pixel(img, 5, 5, PALETTE["red"]); pixel(img, 6, 5, PALETTE["red"])
    # Top-right small
    rect(img, 23, 3, 28, 8, PALETTE["light_gray"]); rect(img, 24, 4, 27, 7, PALETTE["white"])
    pixel(img, 25, 5, PALETTE["red"]); pixel(img, 26, 5, PALETTE["red"])
    # Bottom-left small
    rect(img, 3, 23, 8, 28, PALETTE["light_gray"]); rect(img, 4, 24, 7, 27, PALETTE["white"])
    pixel(img, 5, 25, PALETTE["red"]); pixel(img, 6, 25, PALETTE["red"])
    # Bottom-right small
    rect(img, 23, 23, 28, 28, PALETTE["light_gray"]); rect(img, 24, 24, 27, 27, PALETTE["white"])
    pixel(img, 25, 25, PALETTE["red"]); pixel(img, 26, 25, PALETTE["red"])
    return img

def sprite_word_phantom():
    img = new_sprite()
    rect(img, 9, 6, 22, 22, PALETTE["white"])
    rect(img, 11, 4, 20, 6, PALETTE["white"]); rect(img, 13, 3, 18, 4, PALETTE["white"])
    rect(img, 9, 22, 11, 25, PALETTE["white"]); rect(img, 13, 22, 18, 25, PALETTE["white"]); rect(img, 20, 22, 22, 25, PALETTE["white"])
    rect(img, 9, 25, 11, 26, PALETTE["light_gray"]); rect(img, 13, 25, 18, 26, PALETTE["light_gray"]); rect(img, 20, 25, 22, 26, PALETTE["light_gray"])
    # カ character on body
    rect(img, 14, 9, 17, 10, PALETTE["black"]); rect(img, 16, 10, 17, 18, PALETTE["black"]); rect(img, 13, 14, 16, 15, PALETTE["black"])
    rect(img, 11, 12, 13, 14, PALETTE["yellow"]); rect(img, 18, 12, 20, 14, PALETTE["yellow"])
    pixel(img, 12, 13, PALETTE["black"]); pixel(img, 19, 13, PALETTE["black"])
    rect(img, 5, 12, 9, 15, PALETTE["white"]); rect(img, 22, 12, 26, 15, PALETTE["white"])
    pixel(img, 4, 13, PALETTE["white"]); pixel(img, 27, 13, PALETTE["white"])
    return img

def sprite_mirror_test():
    img = new_sprite()
    rect(img, 9, 4, 22, 6, PALETTE["gold"]); rect(img, 7, 6, 9, 22, PALETTE["gold"]); rect(img, 22, 6, 24, 22, PALETTE["gold"]); rect(img, 9, 22, 22, 24, PALETTE["gold"])
    pixel(img, 8, 5, PALETTE["gold"]); pixel(img, 23, 5, PALETTE["gold"])
    pixel(img, 8, 23, PALETTE["gold"]); pixel(img, 23, 23, PALETTE["gold"])
    rect(img, 10, 7, 21, 21, PALETTE["light_gray"]); rect(img, 13, 10, 18, 16, PALETTE["white"])
    rect(img, 13, 11, 15, 12, PALETTE["blue"]); rect(img, 16, 11, 18, 12, PALETTE["blue"])
    pixel(img, 14, 11, PALETTE["black"]); pixel(img, 17, 11, PALETTE["black"])
    rect(img, 14, 14, 17, 15, PALETTE["black"])
    pixel(img, 11, 9, PALETTE["dark_purple"]); pixel(img, 12, 9, PALETTE["dark_purple"]); pixel(img, 11, 10, PALETTE["dark_purple"])
    pixel(img, 19, 18, PALETTE["dark_purple"]); pixel(img, 20, 18, PALETTE["dark_purple"]); pixel(img, 19, 19, PALETTE["dark_purple"]); pixel(img, 20, 19, PALETTE["dark_purple"])
    pixel(img, 12, 8, PALETTE["white"]); pixel(img, 19, 20, PALETTE["white"])
    return img

def sprite_number_ghost():
    img = new_sprite()
    rect(img, 10, 6, 21, 20, PALETTE["orange"]); rect(img, 12, 4, 19, 6, PALETTE["orange"]); rect(img, 14, 3, 17, 4, PALETTE["orange"])
    rect(img, 10, 20, 12, 23, PALETTE["orange"]); rect(img, 14, 20, 17, 23, PALETTE["orange"]); rect(img, 19, 20, 21, 23, PALETTE["orange"])
    rect(img, 10, 23, 12, 24, PALETTE["dark_red"]); rect(img, 14, 23, 17, 24, PALETTE["dark_red"]); rect(img, 19, 23, 21, 24, PALETTE["dark_red"])
    # 七 (7) character
    rect(img, 13, 9, 18, 10, PALETTE["white"]); rect(img, 15, 10, 16, 17, PALETTE["white"]); rect(img, 13, 13, 16, 14, PALETTE["white"])
    rect(img, 12, 12, 13, 13, PALETTE["white"]); rect(img, 18, 12, 19, 13, PALETTE["white"])
    pixel(img, 12, 12, PALETTE["black"]); pixel(img, 18, 12, PALETTE["black"])
    rect(img, 6, 11, 10, 14, PALETTE["orange"]); rect(img, 21, 11, 25, 14, PALETTE["orange"])
    pixel(img, 5, 12, PALETTE["orange"]); pixel(img, 26, 12, PALETTE["orange"])
    return img

def sprite_is_bug():
    img = new_sprite()
    rect(img, 10, 10, 21, 22, PALETTE["lime"]); rect(img, 12, 8, 19, 10, PALETTE["lime"])
    rect(img, 13, 6, 18, 9, PALETTE["lime"])
    pixel(img, 13, 7, PALETTE["black"]); pixel(img, 15, 7, PALETTE["black"]); pixel(img, 17, 7, PALETTE["black"])
    pixel(img, 11, 8, PALETTE["dark_red"]); pixel(img, 12, 8, PALETTE["dark_red"])
    pixel(img, 19, 8, PALETTE["dark_red"]); pixel(img, 20, 8, PALETTE["dark_red"])
    rect(img, 10, 14, 21, 15, PALETTE["dark_green"]); rect(img, 10, 18, 21, 19, PALETTE["dark_green"])
    rect(img, 6, 12, 10, 13, PALETTE["dark_green"]); rect(img, 6, 16, 10, 17, PALETTE["dark_green"]); rect(img, 6, 20, 10, 21, PALETTE["dark_green"])
    rect(img, 21, 12, 25, 13, PALETTE["dark_green"]); rect(img, 21, 16, 25, 17, PALETTE["dark_green"]); rect(img, 21, 20, 25, 21, PALETTE["dark_green"])
    pixel(img, 13, 4, PALETTE["dark_green"]); pixel(img, 14, 5, PALETTE["dark_green"])
    pixel(img, 17, 4, PALETTE["dark_green"]); pixel(img, 16, 5, PALETTE["dark_green"])
    pixel(img, 8, 10, PALETTE["red"]); pixel(img, 23, 15, PALETTE["red"]); pixel(img, 15, 24, PALETTE["red"])
    return img

def sprite_name_thief():
    img = new_sprite()
    rect(img, 10, 4, 21, 12, PALETTE["dark_purple"]); rect(img, 11, 3, 20, 4, PALETTE["dark_purple"])
    rect(img, 12, 7, 19, 11, PALETTE["black"])
    rect(img, 13, 8, 14, 9, PALETTE["yellow"]); rect(img, 17, 8, 18, 9, PALETTE["yellow"])
    pixel(img, 13, 8, PALETTE["red"]); pixel(img, 17, 8, PALETTE["red"])
    rect(img, 8, 12, 23, 26, PALETTE["dark_purple"]); rect(img, 9, 12, 22, 13, PALETTE["purple"])
    rect(img, 5, 13, 8, 27, PALETTE["dark_purple"]); rect(img, 23, 13, 26, 27, PALETTE["dark_purple"])
    rect(img, 6, 14, 8, 22, PALETTE["dark_purple"]); rect(img, 23, 14, 25, 22, PALETTE["dark_purple"])
    pixel(img, 6, 22, PALETTE["black"]); pixel(img, 25, 22, PALETTE["black"])
    rect(img, 2, 20, 6, 24, PALETTE["cream"])
    pixel(img, 3, 21, PALETTE["black"]); pixel(img, 4, 21, PALETTE["black"]); pixel(img, 5, 21, PALETTE["black"])
    pixel(img, 3, 22, PALETTE["black"]); pixel(img, 4, 23, PALETTE["black"])
    rect(img, 26, 16, 27, 22, PALETTE["light_gray"]); rect(img, 25, 22, 28, 23, PALETTE["gold"])
    rect(img, 11, 26, 14, 30, PALETTE["dark_purple"]); rect(img, 17, 26, 20, 30, PALETTE["dark_purple"])
    rect(img, 10, 29, 15, 31, PALETTE["black"]); rect(img, 16, 29, 21, 31, PALETTE["black"])
    return img

def sprite_confused_merchant():
    img = new_sprite()
    rect(img, 8, 3, 23, 5, PALETTE["yellow"]); rect(img, 11, 1, 20, 3, PALETTE["yellow"]); rect(img, 12, 0, 19, 1, PALETTE["yellow"])
    pixel(img, 15, 2, PALETTE["brown"]); pixel(img, 16, 2, PALETTE["brown"])
    rect(img, 12, 6, 19, 12, PALETTE["skin"])
    pixel(img, 13, 8, PALETTE["black"]); pixel(img, 14, 8, PALETTE["black"]); pixel(img, 17, 8, PALETTE["black"]); pixel(img, 18, 8, PALETTE["black"])
    pixel(img, 13, 0, PALETTE["red"]); pixel(img, 14, 0, PALETTE["red"]); pixel(img, 14, 1, PALETTE["red"]); pixel(img, 14, 2, PALETTE["red"])
    rect(img, 14, 11, 17, 12, PALETTE["dark_red"]); pixel(img, 15, 11, PALETTE["black"]); pixel(img, 16, 11, PALETTE["black"])
    rect(img, 10, 13, 21, 25, PALETTE["brown"]); rect(img, 11, 13, 20, 14, PALETTE["dark_brown"])
    rect(img, 10, 19, 21, 20, PALETTE["dark_red"])
    rect(img, 7, 14, 10, 20, PALETTE["brown"]); rect(img, 21, 14, 24, 20, PALETTE["brown"])
    pixel(img, 7, 20, PALETTE["skin"]); pixel(img, 24, 20, PALETTE["skin"])
    pixel(img, 5, 18, PALETTE["red"]); pixel(img, 6, 19, PALETTE["red"]); pixel(img, 5, 20, PALETTE["red"])
    rect(img, 12, 25, 15, 29, PALETTE["dark_brown"]); rect(img, 16, 25, 19, 29, PALETTE["dark_brown"])
    rect(img, 11, 29, 16, 30, PALETTE["dark_brown"]); rect(img, 15, 29, 20, 30, PALETTE["dark_brown"])
    return img

def sprite_verb_shadow():
    img = new_sprite()
    rect(img, 10, 8, 21, 24, PALETTE["dark_purple"]); rect(img, 12, 4, 19, 9, PALETTE["dark_purple"])
    rect(img, 13, 6, 14, 7, PALETTE["pink"]); rect(img, 17, 6, 18, 7, PALETTE["pink"])
    pixel(img, 14, 12, PALETTE["pink"]); pixel(img, 17, 12, PALETTE["pink"])
    pixel(img, 13, 16, PALETTE["pink"]); pixel(img, 18, 16, PALETTE["pink"])
    rect(img, 6, 10, 10, 18, PALETTE["dark_purple"]); rect(img, 21, 10, 25, 18, PALETTE["dark_purple"])
    rect(img, 4, 2, 5, 18, PALETTE["light_gray"]); rect(img, 3, 18, 6, 19, PALETTE["gold"]); rect(img, 4, 19, 5, 22, PALETTE["brown"])
    pixel(img, 6, 18, PALETTE["dark_purple"])
    rect(img, 26, 8, 29, 9, PALETTE["pink"]); rect(img, 26, 11, 29, 12, PALETTE["pink"]); rect(img, 27, 9, 28, 11, PALETTE["pink"])
    rect(img, 11, 24, 14, 28, PALETTE["dark_purple"]); rect(img, 17, 24, 20, 28, PALETTE["dark_purple"])
    rect(img, 9, 27, 14, 29, PALETTE["black"]); rect(img, 17, 27, 22, 29, PALETTE["black"])
    return img

def sprite_adjective_mist():
    img = new_sprite()
    rect(img, 6, 10, 25, 20, PALETTE["light_gray"])
    rect(img, 8, 7, 23, 10, PALETTE["light_gray"]); rect(img, 10, 5, 21, 7, PALETTE["light_gray"]); rect(img, 12, 4, 19, 5, PALETTE["light_gray"])
    rect(img, 4, 14, 7, 22, PALETTE["light_gray"]); rect(img, 24, 14, 27, 22, PALETTE["light_gray"]); rect(img, 12, 18, 19, 24, PALETTE["light_gray"])
    rect(img, 6, 18, 25, 22, PALETTE["gray"])
    rect(img, 10, 11, 12, 12, PALETTE["dark_blue"]); rect(img, 14, 11, 16, 12, PALETTE["dark_blue"]); rect(img, 18, 11, 20, 12, PALETTE["dark_blue"])
    pixel(img, 11, 11, PALETTE["white"]); pixel(img, 15, 11, PALETTE["white"]); pixel(img, 19, 11, PALETTE["white"])
    rect(img, 13, 15, 18, 16, PALETTE["dark_blue"])
    pixel(img, 14, 16, PALETTE["white"]); pixel(img, 17, 16, PALETTE["white"])
    pixel(img, 8, 8, PALETTE["white"]); pixel(img, 23, 8, PALETTE["white"])
    pixel(img, 5, 16, PALETTE["white"]); pixel(img, 26, 16, PALETTE["white"])
    return img

def sprite_tokkun():
    img = new_sprite()
    rect(img, 9, 1, 22, 4, PALETTE["gold"])
    pixel(img, 7, 2, PALETTE["gold"]); pixel(img, 24, 2, PALETTE["gold"])
    pixel(img, 7, 3, PALETTE["gold"]); pixel(img, 24, 3, PALETTE["gold"])
    pixel(img, 15, 0, PALETTE["gold"]); pixel(img, 16, 0, PALETTE["gold"])
    rect(img, 11, 5, 20, 11, PALETTE["skin"])
    rect(img, 12, 7, 14, 9, PALETTE["white"]); rect(img, 17, 7, 19, 9, PALETTE["white"])
    pixel(img, 13, 7, PALETTE["black"]); pixel(img, 13, 8, PALETTE["black"])
    pixel(img, 18, 7, PALETTE["black"]); pixel(img, 18, 8, PALETTE["black"])
    rect(img, 11, 10, 14, 11, PALETTE["white"]); rect(img, 17, 10, 20, 11, PALETTE["white"])
    rect(img, 12, 11, 19, 16, PALETTE["white"])
    rect(img, 9, 16, 22, 26, PALETTE["gold"])
    rect(img, 12, 18, 19, 25, PALETTE["white"])
    rect(img, 12, 18, 19, 19, PALETTE["dark_brown"]); rect(img, 12, 24, 19, 25, PALETTE["dark_brown"])
    rect(img, 12, 18, 13, 25, PALETTE["dark_brown"]); rect(img, 18, 18, 19, 25, PALETTE["dark_brown"])
    pixel(img, 15, 19, PALETTE["black"]); pixel(img, 16, 19, PALETTE["black"])
    pixel(img, 17, 21, PALETTE["black"]); pixel(img, 15, 24, PALETTE["black"]); pixel(img, 16, 24, PALETTE["black"])
    pixel(img, 13, 21, PALETTE["black"])
    rect(img, 15, 21, 16, 22, PALETTE["black"]); pixel(img, 16, 20, PALETTE["black"])
    rect(img, 5, 17, 9, 23, PALETTE["gold"]); rect(img, 22, 17, 26, 23, PALETTE["gold"])
    pixel(img, 5, 23, PALETTE["gray"]); pixel(img, 6, 23, PALETTE["gray"])
    pixel(img, 25, 23, PALETTE["gray"]); pixel(img, 26, 23, PALETTE["gray"])
    rect(img, 11, 26, 14, 30, PALETTE["gold"]); rect(img, 17, 26, 20, 30, PALETTE["gold"])
    rect(img, 10, 29, 15, 31, PALETTE["dark_brown"]); rect(img, 16, 29, 21, 31, PALETTE["dark_brown"])
    return img

def sprite_kanji_tutor():
    img = new_sprite()
    rect(img, 10, 1, 21, 4, PALETTE["dark_blue"]); rect(img, 9, 4, 22, 5, PALETTE["dark_blue"])
    pixel(img, 15, 0, PALETTE["dark_blue"]); pixel(img, 16, 0, PALETTE["dark_blue"])
    pixel(img, 15, 5, PALETTE["gold"]); pixel(img, 16, 6, PALETTE["gold"])
    rect(img, 11, 6, 20, 12, PALETTE["skin"])
    rect(img, 13, 8, 14, 9, PALETTE["black"]); rect(img, 17, 8, 18, 9, PALETTE["black"])
    rect(img, 12, 7, 14, 8, PALETTE["white"]); rect(img, 17, 7, 19, 8, PALETTE["white"])
    rect(img, 11, 11, 20, 22, PALETTE["white"]); rect(img, 12, 22, 19, 25, PALETTE["white"])
    pixel(img, 13, 25, PALETTE["white"]); pixel(img, 18, 25, PALETTE["white"])
    rect(img, 14, 13, 17, 14, PALETTE["dark_red"])
    rect(img, 8, 17, 23, 28, PALETTE["dark_blue"])
    rect(img, 3, 18, 8, 23, PALETTE["cream"])
    pixel(img, 4, 19, PALETTE["black"]); pixel(img, 5, 19, PALETTE["black"]); pixel(img, 6, 19, PALETTE["black"])
    pixel(img, 4, 21, PALETTE["black"]); pixel(img, 5, 21, PALETTE["black"]); pixel(img, 6, 21, PALETTE["black"])
    pixel(img, 4, 22, PALETTE["black"]); pixel(img, 5, 22, PALETTE["black"]); pixel(img, 6, 22, PALETTE["black"])
    rect(img, 6, 17, 9, 22, PALETTE["dark_blue"]); rect(img, 22, 17, 25, 23, PALETTE["dark_blue"])
    pixel(img, 25, 23, PALETTE["skin"])
    rect(img, 11, 28, 20, 31, PALETTE["dark_blue"])
    return img

def sprite_kanji_book_2():
    img = new_sprite()
    rect(img, 8, 4, 23, 28, PALETTE["dark_red"]); rect(img, 9, 5, 22, 27, PALETTE["red"])
    rect(img, 8, 4, 9, 28, PALETTE["dark_brown"])
    rect(img, 8, 4, 23, 5, PALETTE["gold"]); rect(img, 8, 27, 23, 28, PALETTE["gold"])
    rect(img, 13, 9, 18, 10, PALETTE["gold"]); rect(img, 14, 11, 17, 12, PALETTE["gold"]); rect(img, 13, 14, 18, 15, PALETTE["gold"])
    pixel(img, 14, 13, PALETTE["gold"]); pixel(img, 17, 13, PALETTE["gold"])
    rect(img, 12, 18, 14, 19, PALETTE["yellow"]); rect(img, 17, 18, 19, 19, PALETTE["yellow"])
    pixel(img, 13, 18, PALETTE["black"]); pixel(img, 18, 18, PALETTE["black"])
    rect(img, 13, 22, 18, 23, PALETTE["black"])
    pixel(img, 14, 23, PALETTE["white"]); pixel(img, 17, 23, PALETTE["white"])
    rect(img, 22, 5, 23, 27, PALETTE["cream"])
    pixel(img, 10, 30, PALETTE["purple"]); pixel(img, 12, 31, PALETTE["purple"])
    pixel(img, 19, 31, PALETTE["purple"]); pixel(img, 21, 30, PALETTE["purple"])
    return img

# ===== SPRITE REGISTRY =====
SPRITES = {
    "hero": sprite_hero,
    "yuki": sprite_yuki,
    "slime": sprite_slime,
    "kappa": sprite_kappa,
    "spirit": sprite_spirit,
    "troll": sprite_troll,
    "gardo": sprite_gardo,
    "shadow_king": sprite_shadow_king,
    "mirror_phantom": sprite_mirror_phantom,
    "book_spirit": sprite_book_spirit,
    "kitsune": sprite_kitsune,
    "rokku": sprite_rokku,
    "kanji_book": sprite_kanji_book,
    "lord_vassal": sprite_lord_vassal,
    "k_beast": sprite_k_beast,
    "stone_trio": sprite_stone_trio,
    "mirror_horde": sprite_mirror_horde,
    "word_phantom": sprite_word_phantom,
    "mirror_test": sprite_mirror_test,
    "number_ghost": sprite_number_ghost,
    "is_bug": sprite_is_bug,
    "name_thief": sprite_name_thief,
    "confused_merchant": sprite_confused_merchant,
    "verb_shadow": sprite_verb_shadow,
    "adjective_mist": sprite_adjective_mist,
    "tokkun": sprite_tokkun,
    "kanji_tutor": sprite_kanji_tutor,
    "echo_mirror": sprite_mirror_test,
    "locked_door": sprite_kanji_book_2,
    "merchant_illusion": sprite_confused_merchant,
    "shadow_nh": sprite_spirit,
    "kanji_book_2": sprite_kanji_book_2,
}

# Enemy ID -> sprite name mapping
ENEMY_SPRITE_MAP = {
    "slime-a": "slime",
    "kappa-slime": "kappa",
    "s-spirit": "spirit",
    "t-troll": "troll",
    "gardo": "gardo",
    "shadow-king": "shadow_king",
    "mirror-echo": "echo_mirror",
    "k-beast": "k_beast",
    "shadow-nh": "shadow_nh",
    "three-siblings": "stone_trio",
    "mirror-test": "mirror_test",
    "locked-door": "locked_door",
    "stone-trio": "stone_trio",
    "mirror-horde": "mirror_horde",
    "word-phantom": "word_phantom",
    "mirror-phantom": "mirror_phantom",
    "merchant-illusion": "merchant_illusion",
    "book-spirit": "book_spirit",
    "kitsune-bi": "kitsune",
    "rokku": "rokku",
    "confused-merchant": "confused_merchant",
    "name-thief": "name_thief",
    "is-bug": "is_bug",
    "number-ghost": "number_ghost",
    "tokkun": "tokkun",
    "kanji-tutor": "kanji_tutor",
    "kanji-book": "kanji_book",
    "verb-shadow": "verb_shadow",
    "adjective-mist": "adjective_mist",
    "lord-vassal": "lord_vassal",
}

def main():
    print(f"Generating {len(SPRITES)} pixel art sprites (32x32, scaled 8x = 256x256)...")
    print(f"Output: {OUTPUT_DIR}\n")
    manifest = {}
    for name, generator in SPRITES.items():
        img = generator()
        path = save_sprite(img, name, scale=8)
        manifest[name] = {"file": f"{name}.png", "path": f"/sprites/{name}.png", "size": 32, "scaled": 256}
    manifest_path = os.path.join(OUTPUT_DIR, "manifest.json")
    with open(manifest_path, "w") as f:
        json.dump({"sprites": manifest, "enemyMap": ENEMY_SPRITE_MAP}, f, indent=2)
    print(f"\n+ Manifest saved: {manifest_path}")
    print(f"\n[OK] Generated {len(SPRITES)} sprites successfully!")
    print(f"\nEnemy sprite map ({len(ENEMY_SPRITE_MAP)} entries):")
    for enemy_id, sprite_name in ENEMY_SPRITE_MAP.items():
        print(f"  {enemy_id} -> {sprite_name}.png")

if __name__ == "__main__":
    main()
