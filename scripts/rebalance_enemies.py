#!/usr/bin/env python3
"""
Rebalance all enemy HP & attack in stage files.
- Regular enemies: HP x2.5, ATK x1.5
- Mini-boss: HP x4, ATK x2
- Boss: HP x6, ATK x2.5
Also add more questions to each stage (target 8-10).
"""

import re
import os

FILES = [
    "/home/z/my-project/src/lib/game/stages.ts",
    "/home/z/my-project/src/lib/game/katakana-stages.ts",
    "/home/z/my-project/src/lib/game/n5-stages.ts",
]

def rebalance_file(path):
    with open(path, "r") as f:
        content = f.read()

    # Find all stage blocks and their types
    # We need to identify each enemy block by looking at the surrounding stage type
    # Strategy: parse stage by stage, find type, then multiply HP/ATK in enemies

    # Find all enemy blocks with their stage type context
    # Pattern: stage type appears as `type: "lesson"|"battle"|"mini-boss"|"boss"`
    # Then enemies: [ { ... hp: N, attack: N, ... } ]

    # Multiplier based on stage type
    def get_mult(stage_type):
        if stage_type == "boss":
            return (6, 2.5)  # HP, ATK
        elif stage_type == "mini-boss":
            return (4, 2.0)
        else:
            return (2.5, 1.5)

    # Split by stage definitions
    # We'll track current stage type and apply multipliers to enemies within

    result = []
    current_stage_type = "battle"

    # Use a state machine: scan line by line
    lines = content.split("\n")
    in_enemies = False
    in_questions = False

    i = 0
    while i < len(lines):
        line = lines[i]

        # Detect stage type
        type_match = re.search(r'type:\s*"(lesson|battle|mini-boss|boss)"', line)
        if type_match:
            current_stage_type = type_match.group(1)

        # Detect enemies array start
        if "enemies: [" in line:
            in_enemies = True
        if "questions: [" in line:
            in_enemies = False
            in_questions = True

        # Apply HP multiplier when inside enemies block
        if in_enemies:
            hp_mult, atk_mult = get_mult(current_stage_type)
            # Match: hp: N,
            hp_match = re.match(r'(\s*hp:\s*)(\d+)(,\s*)$', line)
            if hp_match:
                old_hp = int(hp_match.group(2))
                new_hp = max(1, int(round(old_hp * hp_mult)))
                line = f"{hp_match.group(1)}{new_hp}{hp_match.group(3)}"
            atk_match = re.match(r'(\s*attack:\s*)(\d+)(,\s*)$', line)
            if atk_match:
                old_atk = int(atk_match.group(2))
                new_atk = max(1, int(round(old_atk * atk_mult)))
                line = f"{atk_match.group(1)}{new_atk}{atk_match.group(3)}"

        result.append(line)
        i += 1

    new_content = "\n".join(result)
    with open(path, "w") as f:
        f.write(new_content)
    print(f"Rebalanced: {path}")

for f in FILES:
    rebalance_file(f)

print("Done!")
