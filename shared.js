// Contains general utility functions used by multiple pages.

// Stolen from https://stackoverflow.com/questions/17386707/how-to-check-if-a-canvas-is-blank
// returns true if every pixel's uint32 representation is 0 (or "blank")
function isCanvasBlank(canvas) {
  const context = canvas.getContext('2d');
  const pixelBuffer = new Uint32Array(
    context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
        );
  return !pixelBuffer.some(color => color !== 0);
}


// Generate some spaced x-coordinates to ex: assign plants to
// Used with smart placement
function createSpacedPlacementQueue(total_width, with_spacing=64){
  x_coords = [];
  // Random number between, by default, 0 and 16 (remember we already place ground-centered in a 64x area)
  var range = Math.floor(with_spacing/4);
  current_x = Math.floor(Math.random()*range);
  // 64 below to avoid plants getting cut off on the edges.
  while(current_x < (total_width-64)){
    x_coords.push(current_x);
    current_x += with_spacing+Math.floor(Math.random()*range*2-range);
  }
  shuffleArray(x_coords);
  return x_coords
}


// Open a new page to claim the contents of a canvas.
function claimCanvas(canvas){
  var new_window = window.open();
  var image = new_window.document.createElement('img');
  var instructions = new_window.document.createElement('p');
  instructions.innerHTML = "Right-click the image and save it, or copy it to a host like Imgur or Discord";
  image.src = canvas.toDataURL();
  new_window.document.body.appendChild(image);
  new_window.document.body.appendChild(instructions);
  return new_window;
}


// Returns true if there's a non-transparent pixel in `row` in ImageData `image_data`. Row is 0-indexed.
// Modified from https://stackoverflow.com/questions/11796554/automatically-crop-html5-canvas-to-contents
function hasPixelInRow(image_data, row, width=32){
    var index, x;
    for (x = 0; x < width; x++) {
        index = (row * width + x) * 4;
        if (image_data.data[index+3] > 0) {
            return true;
        }
    }
    return false;
}

// Shuffles an array in place
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function get_overlay_color_from_name(color, alpha){
    color = color.slice(1);
    if(available_overlay_colors.hasOwnProperty(color)){ color = available_overlay_colors[color]; }
    let rgb_code = hexToRgb(color)
    rgb_code.push(255*alpha)
    return rgb_code;
}

async function applyOverlay(place_onto_canvas, color, opacity){
    let place_onto_ctx = place_onto_canvas.getContext("2d");
    let color_canvas = document.createElement("canvas");
    let color_ctx = color_canvas.getContext("2d");
    color_canvas.width = place_onto_canvas.width;
    color_canvas.height = place_onto_canvas.height;
    let rgb_code = get_overlay_color_from_name(color, opacity);

    // With our color info loaded, we apply the color itself to its own canvas
    let main_imgData = place_onto_ctx.getImageData(0, 0, color_canvas.width, color_canvas.height).data;
    let color_img = color_ctx.getImageData(0, 0, color_canvas.width, color_canvas.height);
    let color_imgData = color_img.data;
    // Loops through bytes and only place color if the area below has some alpha.
    for ( var i = 0; i < main_imgData.length; i += 4 ) {
        if ( main_imgData[i + 3] > 0 ) {
            color_imgData[i] = rgb_code[0];
            color_imgData[i+1] = rgb_code[1];
            color_imgData[i+2] = rgb_code[2];
            color_imgData[i+3] = rgb_code[3];
        }}
    color_ctx.putImageData(color_img, 0, 0);
    place_onto_ctx.drawImage(color_canvas,0,0);
    return({"canvas": color_canvas, "x_pos": 0, "y_pos": 0, "width": color_canvas.width, "height": color_canvas.height});
}

// tile an image left to right across a canvas at some y
// optionally, offset them all to the left (or right, if you prefer) to
// make the tileables look somewhat different from garden to garden
async function tileAlongY(tileCtx, img, yPos, xOffset=0){
    let groundXPos = xOffset;
    while(groundXPos < garden_width){
        tileCtx.drawImage(img, groundXPos, yPos, img.width*2, img.height*2);
        groundXPos += img.width*2;
    }
}

function clearCanvas(canvas){
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Flexibly take input (URL, drag-and-drop, paste, or file upload) for a wildcard by creating a popup box
// attached to some parent. Load whatever we find into all_named
// This is far jankier than it needs to be since Javascript only pauses for prompt, alert, and confirm
// Largely taken from https://soshace.com/the-ultimate-guide-to-drag-and-drop-image-uploading-with-pure-javascript/
async function imageFromPopup(parent, name_of_image, callback){
    var form = document.createElement("div");
    form.className = "popup";
    let helptext = document.createElement("div");
    helptext.innerHTML = "<h3>"+name_of_image+"</h3>Paste an image (or image URL), or drag-and-drop one from your files:";
    helptext.style.padding = "1vw";
    helptext.style.textAlign = "center";
    let urlTaker = document.createElement("input");
    urlTaker.style.min_height = "3vh";
    urlTaker.className = "garden-dim-bar";
    var preview = document.createElement("img");
    let preview_container = document.createElement("div");
    preview_container.className = "scaled_preview_container";
    preview_container.appendChild(preview);
    let confirm_button = document.createElement("input");
    confirm_button.type = "button";
    confirm_button.value = "Confirm";
    confirm_button.style.width = "auto";
    urlTaker.addEventListener("input", async function() {
        if(urlTaker.files == null){
            preview.src = await resize_for_garden(name_of_image, urlTaker.value);
        } else {
            handleImage(urlTaker.files, name_of_image, preview);
        }
    })
    urlTaker.addEventListener("paste", function(event) {
      var items = (event.clipboardData || event.originalEvent.clipboardData).items;
      for (index in items) {
        var item = items[index];
        if (item.kind === 'file') {
          var blob = item.getAsFile();
          handleImage([blob], name_of_image, preview);
        }
      }
    })
    confirm_button.addEventListener("click", function() {
        parent.removeChild(form);
        // we got here by interrupting initial garden generation; restart it
        callback();
    })
    function preventDefault(e) { e.preventDefault(); e.stopPropagation;}
    function handleDrop(e) {handleImage(e.dataTransfer.files, name_of_image, preview);}
    form.addEventListener("dragenter", preventDefault, false);
    form.addEventListener("dragleave", preventDefault, false);
    form.addEventListener("dragover", preventDefault, false);
    form.addEventListener("drop", preventDefault, false);
    form.addEventListener("drop", handleDrop, false);
    form.appendChild(helptext);
    form.appendChild(urlTaker);
    form.appendChild(preview_container);
    form.appendChild(confirm_button);
    parent.appendChild(form);
    urlTaker.focus();
    return form;
}

// Helper for imageFromPopup, handles image file validation
async function handleImage(files, name_of_image, preview_img) {
    if(files.length > 1){
        alert("Multiple uploads detected, only the first will be used");
    }
    let file = files[0];
    let validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (validTypes.indexOf( file.type ) == -1){
        alert("Bad file type, please use a png, gif, or jpeg");
    } else {
        let dataURL = await getBase64(file)
        preview_img.src = await resize_for_garden(name_of_image, dataURL);
    }
}

// Shrinks an image at a URL down to 32, then up to 64, then loads it into our refs
async function resize_for_garden(name_of_image, sourceURL){
    let refURL = name_of_image+"_wildcard_data_url"
    all_named[name_of_image] = refURL;
    let temp_img = await preload_single_image(sourceURL);
    // Forcibly resize to 32x32
    let wildcard_canvas = document.createElement("canvas");
    wildcard_canvas.width = 32;
    wildcard_canvas.height = 32;
    let max_side = Math.max(temp_img.naturalHeight, temp_img.naturalWidth);
    let wildcard_ctx = wildcard_canvas.getContext("2d");
    wildcard_ctx.imageSmoothingEnabled = false;
    // Do a bit of math so that, if the image isn't a perfect square, we don't squash it.
    wildcard_ctx.drawImage(temp_img, 0, 32-temp_img.naturalHeight*(32/max_side),
                           temp_img.naturalWidth*(32/max_side),
                           temp_img.naturalHeight*(32/max_side));
    let resized_dataURL = wildcard_canvas.toDataURL(temp_img.type);
    refs[refURL] = await preload_single_image(resized_dataURL);
    let preview_canvas = document.createElement("canvas");
    let preview_context = preview_canvas.getContext("2d");
    preview_canvas.width = 64;
    preview_canvas.height = 64;
    preview_context.imageSmoothingEnabled = false;
    preview_context.drawImage(refs[refURL], 0, 0, 64, 64);
    return preview_canvas.toDataURL(temp_img.type);
}


function getBase64(file) {
    return new Promise(function(resolve) {
      var reader = new FileReader();
      reader.onloadend = function() {
        resolve(reader.result)
      }
      reader.readAsDataURL(file);
    })
  }
