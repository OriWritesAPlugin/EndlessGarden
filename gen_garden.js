var img_loadup = [];
var possible_grass_palettes = [];
var grass_img = "https://i.imgur.com/yPNa3WB.png";
var x_coords = [];
var smart_coords = {};
var garden_width = 450;
var current_x_coord;
var used_smart_coords;
var used_fallback_coords;
var use_smart_spacing = true;
var grass_palette = null;
var components_to_place = [];  // Format: {"x_pos": , "seed": , "canvas": }. Note idx 0=placed first, 1=placed second, ...n=placed last (topmost)


async function gen_randogarden(reuse_and_scramble_positions=false) {
    // canvases seem to be stranger than I thought. It's like...every time I call this, it's
    // a "new" canvas. Even without clearRect, the old garden gets "replaced", instead of having more
    // drawn onto it. Why? Am I calling something wrong someplace?
    // Not re-creating ctx didn't help. I tried global and I'm still seeing the "replacement" behavior.
    var canvas = document.getElementById("output_canvas");
    var ctx = canvas.getContext("2d");
    // I'm noticing that Firefox insists I'm in Quirks mode despite the doctype while working locally. Related?
    // I'd really prefer not to have to push to test.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    components_to_place = [];
    // What does it mean if someone changes their option for smart spacing, then scrambles?
    // Functionally it's nonsense --you're saying both "I want my coords to obey a different rule" and "I don't want my coords to change"
    // We have to pick between nothing changing (confusing), everything getting wiped (alarming), and regenerating the garden (not a scramble)
    // We go with that last case, if only because it seems the least unexpected. So we check against the use_smart_spacing from last time...
    if(use_smart_spacing != document.getElementById("use_smart_spacing").checked && reuse_and_scramble_positions){
        reuse_and_scramble_positions = false;
    }
    use_smart_spacing = document.getElementById("use_smart_spacing").checked;
    generate_grass = document.getElementById("generate_grass").checked;
    garden_width = Math.max(64, document.getElementById("garden_width").value);
    document.getElementById("garden_width").value = garden_width;  // min in the HTML doesn't seem to enforce itself.
    canvas.width = garden_width;
    ctx.imageSmoothingEnabled = false;
    possible_grass_palettes = [];
    // Remove spaces and leading/trailing commas, then split on remaining commas
    var seeds = document.getElementById("seed_list").value.split(" ").join("").replace(/(^,)|(,$)/g, '').split(",");
    var promises = []
    // Generate a set of coordinates to place items at
    if(!reuse_and_scramble_positions){
        if(use_smart_spacing){
            smart_coords = {};
            // TODO: Surely I can simplify this
            smart_coords["short"] = createSpacedPlacementQueue(garden_width, with_spacing=32);
            smart_coords["medium"] = createSpacedPlacementQueue(garden_width, with_spacing=40);
            smart_coords["tall"] = createSpacedPlacementQueue(garden_width, with_spacing=64);
            smart_coords["short_named"] = createSpacedPlacementQueue(garden_width, with_spacing=32);
            smart_coords["medium_named"] = createSpacedPlacementQueue(garden_width, with_spacing=40);
            smart_coords["tall_named"] = createSpacedPlacementQueue(garden_width, with_spacing=64);
        }
        // Even when using smart spacing, we want these as a fallback.
        x_coords = [];
        for(var i=0; i<seeds.length; i++){
            x_coords.push(Math.floor(Math.random()*(garden_width-64)));
        }
    // Reuse the coordinates from last time
    } else {
        if(use_smart_spacing){
            // TODO: SURELY I CAN SIMPLIFY THIS
            smart_coords["short"] = used_smart_coords["short"].sort(() => Math.random() - 0.5);
            smart_coords["medium"] = used_smart_coords["medium"].sort(() => Math.random() - 0.5);
            smart_coords["tall"] = used_smart_coords["tall"].sort(() => Math.random() - 0.5);
            smart_coords["short_named"] = used_smart_coords["short_named"].sort(() => Math.random() - 0.5);
            smart_coords["medium_named"] = used_smart_coords["medium_named"].sort(() => Math.random() - 0.5);
            smart_coords["tall_named"] = used_smart_coords["tall_named"].sort(() => Math.random() - 0.5);
            x_coords = used_fallback_coords.sort(() => Math.random() - 0.5);
        } else {
            x_coords.push(...used_fallback_coords);  // Recycle anything used for ex: named seeds
            x_coords.sort(() => Math.random() - 0.5);
        }
    }
    // TODO Seriously I am sure there's some list comprehension-like thing I could use to trim like 12 lines of tall_named nonsense.
    used_smart_coords = {"short": [], "medium": [], "tall": [], "short_named": [], "medium_named": [], "tall_named": []};  // Reset
    used_fallback_coords = []  // Reset too

    // Dispatch logic for figuring out where everything goes
    for(var i=0; i<seeds.length; i++){
        if(seeds[i][0] == "!"){
            components_to_place.push(assign_named_component(seeds[i].slice(1), ctx, x_coords[i], use_smart_spacing));
        } else {
            // Smart_spacing logic goes inside here so we only have to draw the plant once. x_coords[i] acts as fallback.
            components_to_place.push(assign_plants(seeds[i], ctx, x_coords[i], use_smart_spacing));
        }
    }
    // Wait for logic to complete and place (this is how we maintain a layering order)
    for(var i=0; i<components_to_place.length; i++){
        component = await components_to_place[i];
        await place_component(ctx, component);
    }
    
    if(generate_grass){place_grass();}
}

async function scramble_randogarden(){
    gen_randogarden(reuse_and_scramble_positions=true);
}

async function place_grass(scramble_grass=false){
    var canvas = document.getElementById("output_canvas");
    var ctx = canvas.getContext("2d");
    if(grass_palette==null){
      grass_palette = all_palettes[random_from_list(possible_grass_palettes)];
    } else if(scramble_grass){
      // Try to avoid scrambling to the same grass twice in a row
      for(let allowed_attempts=20; allowed_attempts>0; allowed_attempts--){
        let temp_palette = all_palettes[random_from_list(possible_grass_palettes)];
        if(JSON.stringify(temp_palette) != JSON.stringify(grass_palette)){
          grass_palette = temp_palette;
          break;
        }
      }
    }
    var recolored_grass = replace_color_palette_single_image(base_foliage_palette, grass_palette, refs[grass_img]);
    var grass_x_pos = 0;
    while(grass_x_pos < garden_width){
        ctx.drawImage(recolored_grass, grass_x_pos, 64, 200, 6);
        grass_x_pos += 200;
    }
}

function claim_garden(){
    claimCanvas(document.getElementById("output_canvas"));
}

// Assign a position to a component depending on its type, height, and use of smart spacing.
async function assign_component(canvas, ctx, x_pos, seed, is_named, use_smart_spacing){
    var component_info = {"canvas": canvas, "seed": seed};
    if(use_smart_spacing){
        var smart_coord;
        // We estimate the height by seeing if there's a pixel found at a specific row
        // That does mean we think clouds are short...but those go behind everything else anyways.
        var image_data = canvas.getContext("2d").getImageData(0,0,canvas.width,canvas.height);
        var height;
        if(!hasPixelInRow(image_data, 32-7, width=canvas.width)){
            height = "short";
        }
        else if(!hasPixelInRow(image_data, 32-19, width=canvas.width)){
            height = "medium";
        }
        else {
            height = "tall";
        }
        if(is_named){height+="_named";}  // TODO enum this
        // We need to make sure there's coords left to take
        smart_coord = smart_coords[height].pop();
        if(smart_coord!=undefined){x_pos = smart_coord;}
        used_smart_coords[height].push(x_pos);
    }
    component_info["x_pos"]=x_pos;
    return component_info;
    
}

async function place_component(ctx, component){
    ctx.drawImage(component["canvas"], component["x_pos"], 4, 64, 64);
}

async function assign_named_component(name, ctx, x_pos, use_smart_spacing=false){
    // TODO: This is hideous and terrible but I am very tired and wanted to write something before bed
    var work_canvas = document.createElement("canvas");
    var work_ctx=work_canvas.getContext("2d");
    work_canvas.width = work_canvas_size;
    work_canvas.height = work_canvas_size;
    await place_image_at_coords_with_chance(all_named[name], [[Math.floor(work_canvas_size/2), work_canvas_size-1]], work_ctx, 1, true);
    return assign_component(work_canvas, ctx, x_pos, name, is_named=true, use_smart_spacing=use_smart_spacing);
}

async function assign_plants(seed, ctx, x_pos, use_smart_spacing=false){
    plant_canvas = await gen_plant_from_seed(seed);
    return assign_component(plant_canvas, ctx, x_pos, seed, is_named=false, use_smart_spacing);
}

async function gen_plant_from_seed(seed) {
    var plant_data = decode_plant_data(seed);
    possible_grass_palettes.push(plant_data["foliage_palette"]);
    var ret_canvas = await gen_plant(plant_data);
    return ret_canvas;
}


async function do_preload() {
    refs[grass_img] = await preload_single_image(grass_img);
    await preload_all_images();
}
