#!/usr/bin/env bash

# --- Configuration ---

FONT_RATIO="0.44"
LUMINANCE_THRESHOLD=30
ASCII_CHARS=" .'\`^,:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"

# Video processing settings
VIDEO_FORMATS=("mp4" "mkv" "mov" "avi")
OUTPUT_FPS=30
OUTPUT_COLUMNS=80

# Color definitions (from your Homer video)
RED="220,50,50"
RED_DISTANCE_TOLERANCE=100

YELLOW="240,200,50"
YELLOW_DISTANCE_TOLERANCE=100

WHITE="220,220,220"
WHITE_DISTANCE_TOLERANCE=80

BLACK="20,20,20"
BLACK_DISTANCE_TOLERANCE=60

# --- Functions ---
#
# Calculates the distance between two RGB colors
#
# @param $1: r,g,b color #1
# @param $2: r,g,b color #2
#
color_distance_from() {
    awk -v c1="$1" -v c2="$2" '
        BEGIN {
            split(c1, a, ",");
            split(c2, b, ",");
            print abs(a[1] - b[1]) + abs(a[2] - b[2]) + abs(a[3] - b[3]);
        }
        function abs(x) { return ((x < 0) ? -x : x) }
    '
}

#
# Outputs the appropriate ASCII character with color tag for a given RGB color.
#
# @param $1: The r,g,b Pixel (e.g., "255,215,0")
#
pixel_for() {
    local r g b
    IFS=',' read -r r g b <<< "$1"

    # Calculate relative luminance (a measure of brightness) from 0-255.
    local luminance
    luminance=$(awk -v r="$r" -v g="$g" -v b="$b" 'BEGIN{print int(0.2126*r + 0.7152*g + 0.0722*b)}')

    # If the pixel's brightness is below our threshold, render it as a blank space.
    if (( luminance < LUMINANCE_THRESHOLD )); then
        echo -n " "
        return
    fi

    # Map the remaining luminance range (THRESHOLD to 255) to our character set
    local num_chars=${#ASCII_CHARS}
    local effective_luminance=$((luminance - LUMINANCE_THRESHOLD))
    local luminance_range=$((255 - LUMINANCE_THRESHOLD))

    if (( luminance_range <= 0 )); then luminance_range=1; fi

    local char_index=$(( (effective_luminance * (num_chars - 1)) / luminance_range ))
    local char="${ASCII_CHARS:$char_index:1}"

    # Detect color and output with tag
    local red_distance=$(color_distance_from "$RED" "$1")
    local yellow_distance=$(color_distance_from "$YELLOW" "$1")
    local white_distance=$(color_distance_from "$WHITE" "$1")
    local black_distance=$(color_distance_from "$BLACK" "$1")

    if [[ $red_distance -lt $RED_DISTANCE_TOLERANCE ]]; then
        echo -n "R{$char}R"
    elif [[ $yellow_distance -lt $YELLOW_DISTANCE_TOLERANCE ]]; then
        echo -n "Y{$char}Y"
    elif [[ $white_distance -lt $WHITE_DISTANCE_TOLERANCE ]]; then
        echo -n "W{$char}W"
    elif [[ $black_distance -lt $BLACK_DISTANCE_TOLERANCE ]]; then
        echo -n "K{$char}K"
    else
        # Default: use actual RGB color
        echo -n "C{$r,$g,$b:$char}C"
    fi
}

#
# Extracts frames from a video, converts them to text, and processes them into colored ASCII art.
#
# @param $1: The video file
# @param $2: The directory to place the output files
#
generate_frame_images() {
    local video_file="$1"
    local working_dir="$2"
    local frame_images_dir="$working_dir/frame_images"
    mkdir -p "$frame_images_dir"

    echo "Extracting frames from '$video_file'..."
    ffmpeg \
        -loglevel error \
        -i "$video_file" \
        -vf "scale=$OUTPUT_COLUMNS:-2,fps=$OUTPUT_FPS" \
        "$frame_images_dir/frame_%04d.png"

    echo "Processing frames into colored ASCII..."
    for f in $(find "$frame_images_dir" -name '*.png' | sort); do
        local squished_image_file="${f%.png}_squished.png"
        local image_height
        image_height=$(magick identify -ping -format '%h' "$f")
        local new_height
        new_height=$(awk -v ratio="$FONT_RATIO" -v height="$image_height" 'BEGIN{print int(ratio * height + 0.5)}')

        magick "$f" -resize "x$new_height"'!' "$squished_image_file"

        local imagemagick_text_file="${f%.png}_im.txt"
        local output_text_file="${f%.png}.txt"

        magick "$squished_image_file" "$imagemagick_text_file"

        local last_row=-1
        tail -n +2 "$imagemagick_text_file" | while read -r line; do
            local xy_part="${line%% *}"
            local rgb_part="${line#*srgb(}"
            local rgb="${rgb_part%')'}"
            local row="${xy_part#*,}"
            row="${row%:}"

            if [[ "$row" != "$last_row" ]]; then
                if (( last_row != -1 )); then
                    echo "" >> "$output_text_file"
                fi
                last_row=$row
            fi

            pixel_for "$rgb" >> "$output_text_file"
        done
        echo "" >> "$output_text_file"

        # Convert color tags to HTML spans
        local html_file="${f%.png}.html"
        cat "$output_text_file" \
            | perl -pe 's/R\{(.+?)\}R/<span style="color:#dc2626">\1<\/span>/g' \
            | perl -pe 's/Y\{(.+?)\}Y/<span style="color:#eab308">\1<\/span>/g' \
            | perl -pe 's/W\{(.+?)\}W/<span style="color:#f5f5f5">\1<\/span>/g' \
            | perl -pe 's/K\{(.+?)\}K/<span style="color:#404040">\1<\/span>/g' \
            | perl -pe 's/C\{(\d+),(\d+),(\d+):(.+?)\}C/<span style="color:rgb(\1,\2,\3)">\4<\/span>/g' \
            > "$html_file"

        rm "$f" "$squished_image_file" "$imagemagick_text_file" "$output_text_file"
        echo "Processed ${f##*/}"
    done
    echo "ASCII generation complete."
}

#
# Main function to orchestrate the video-to-ASCII conversion.
#
# @param $1: The path to the video file
#
video_to_terminal() {
    local video_file="$1"
    if [[ -z "$video_file" ]]; then
        >&2 echo "Error: No input file specified."
        >&2 echo "Usage: $0 <path_to_video_file>"
        return 1
    fi

    if [[ ! -f "$video_file" ]]; then
        >&2 echo "Error: Input file '$1' does not exist."
        return 1
    fi

    local file_extension
    file_extension="$(echo "${video_file##*.}" | awk '{print tolower($0)}')"
    if [[ ! " ${VIDEO_FORMATS[*]} " =~ " ${file_extension} " ]]; then
        >&2 echo "Error: Unsupported file format '$file_extension'."
        >&2 echo "Supported formats: ${VIDEO_FORMATS[*]}"
        return 1
    fi

    local working_dir="./ascii_frames_$(date +%s)"
    mkdir "$working_dir"
    echo "Created working directory: $working_dir"

    generate_frame_images "$video_file" "$working_dir"

    echo "All frames processed. HTML files are in '$working_dir/frame_images/'"
}

# --- Execution ---
video_to_terminal "$1"