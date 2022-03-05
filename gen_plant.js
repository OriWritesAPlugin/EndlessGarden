// This contains the code for generating a random plant badge.
// I wrote it with limited internet access, meaning that it looks like Python and uses no clever Javascript tricks.
// You've been warned!

// The colors we'll be replacing. Touch at your peril!
var base_foliage_palette = ["#aed740", "#76c935", "#50aa37", "#2f902b"];
var base_accent_palette = ["fef4cc", "fde47b", "ffd430", "ecb600"];
var base_feature_palette = ["f3addd", "d87fbc", "c059a0", "aa3384"];
var overall_palette = base_foliage_palette.concat(base_accent_palette).concat(base_feature_palette);

var work_canvas_size = 32;  // in pixels
// Roll more than this out of 1 to have two pieces of base foliage.
var two_foliage_roll = 0.95;

// A pixel of these colors indicates we should place the corresponding feature type
var place_complex_feature = "#ff943a";
var place_simple_feature = "#e900ff";

// Javascript can't access images by path.
// This workaround is hideous, but what can ya do :) (while hosting to github and not using ajax, I mean)
//0-indexed count: 42
all_foliage = ["https://i.imgur.com/PabdLnL.png", "https://i.imgur.com/WN2m2Aa.png", "https://i.imgur.com/wsC3ifp.png",
               "https://i.imgur.com/NFM09J5.png", "https://i.imgur.com/urBlTiV.png", "https://i.imgur.com/kyfs2Yl.png",
               "https://i.imgur.com/nMW2bBb.png", "https://i.imgur.com/tBQb6yy.png", "https://i.imgur.com/5j6u58a.png",
               "https://i.imgur.com/Mb1wqi1.png", "https://i.imgur.com/Rk7vvo3.png", "https://i.imgur.com/DdEYVYA.png",
               "https://i.imgur.com/IF5MQWY.png", "https://i.imgur.com/Z6njdmV.png", "https://i.imgur.com/cDAqt4U.png",
               "https://i.imgur.com/117aiCY.png", "https://i.imgur.com/7ZrX05Y.png", "https://i.imgur.com/ZMe5J0j.png",
               "https://i.imgur.com/wLsuJSX.png", "https://i.imgur.com/dxJbfgi.png", "https://i.imgur.com/l1MK3yJ.png",
               "https://i.imgur.com/kTbrzeL.png", "https://i.imgur.com/s4Uav2q.png", "https://i.imgur.com/6GPgZzr.png",
               "https://i.imgur.com/E6ikrq8.png", "https://i.imgur.com/MyF1tCA.png", "https://i.imgur.com/5y1UeDM.png",
               "https://i.imgur.com/uYswz0s.png", "https://i.imgur.com/qGczjJf.png", "https://i.imgur.com/PaWgGAq.png",
               "https://i.imgur.com/bD2FqpL.png", "https://i.imgur.com/NzGJLcK.png", "https://i.imgur.com/62lbxgE.png",
               "https://i.imgur.com/t6NI9ZW.png", "https://i.imgur.com/ubsbt7W.png", "https://i.imgur.com/W0099oE.png",
               "https://i.imgur.com/xEnajhL.png", "https://i.imgur.com/NF6IfWI.png", "https://i.imgur.com/DNJakBN.png",
               "https://i.imgur.com/65fD3Wt.png", "https://i.imgur.com/GhHUZAm.png", "https://i.imgur.com/Wtmyg00.png",
               "https://i.imgur.com/k7FDQzk.png"];
// Doing it this way lets us preserve the numbering to know which plant is which.
// But it's also key to how the seeds work!
common_foliage = [0, 1, 5, 8, 12, 14, 19, 26, 28, 38, 41];
uncommon_foliage = common_foliage.concat([2, 3, 4, 7, 9, 10, 11, 13, 15, 18, 20, 21, 24, 25, 29, 31, 35, 36, 42]);
rare_foliage = uncommon_foliage.concat([6, 16, 17, 22, 23, 27, 30, 32, 33, 34, 37, 39, 40]);
boosted_rare_foliage = rare_foliage.slice(common_foliage.length);

//override_foliage = [39];


// bingo difficulty could be difficulty*size_rating+1. so an easy*small is (1*1+1=2), easy*medium is (1*2+1), hard*big is (3*3+1=10), pain*medium is (2*4+1=9)
// maybe you sometimes get a free max(1,difficulty-2) plant as a bonus so that that level 1 is somewhat relevant. or something.

all_features = ["https://i.imgur.com/G4h84Ht.png", "https://i.imgur.com/vXQYMkL.png", "https://i.imgur.com/p1ipMdS.png", "https://i.imgur.com/UUFJO7h.png"]
var simple_features = [0, 1];
var complex_features = [2, 3];


// zero-indexed count: 40
var all_palettes = [["aed740", "76c935", "50aa37", "2f902b"], ["a2ac4d", "8f974a", "66732a", "4b692f"],
                    ["7ad8b7", "5eb995", "3e946d", "277b50"], ["9dbb86", "679465", "476f58", "2f4d47"],
                    ["8fbe99", "7faf89", "3f7252", "285d3c"], ["fdff07", "b9d50f", "669914", "34670b"],
                    ["b0f7a9", "7dcc75", "63aa5a", "448d3c"], ["c5af7a", "a6905c", "806d40", "69582e"],
                    ["6ee964", "54c44b", "3da136", "228036"], ["e7d7c1", "a78a7f", "735751", "603f3d"],
                    ["9c6695", "734978", "4c2d5c", "2f1847"], ["f8cd1e", "d3a740", "b2773a", "934634"],
                    ["e4eaf3", "c0cfe7", "9ab3db", "7389ad"], ["b98838", "8c6526", "8c6526", "54401f"],
                    ["8f8090", "655666", "453946", "2a212b"], ["f5dbd7", "eec3c3", "d396a8", "c9829d"],
                    ["d1d2f9", "a3bcf9", "7796cb", "576490"], ["eff0ba", "e2c3b2", "ce86a8", "c56497"],
                    ["e88c50", "d0653e", "af3629", "9b1f1f"], ["fef4cc", "fde47b", "ffd430", "ecb600"],
                    ["f3addd", "d87fbc", "c059a0", "aa3384"], ["3ac140", "1b9832", "116d22", "085c17"],
                    ["eaf4bd", "aade87", "6cc750", "1aaa09"], ["b77e4e", "88572e", "674426", "543a24"],
                    ["b7ed6c", "83d764", "47be5c", "0ca553"], ["f3eacf", "e4d4be", "ccb4a4", "b69389"],
                    ["edc55c", "d99b61", "bf7464", "a6636c"], ["8bfdd6", "55dbc3", "25b8b5", "0b8c9d"],
                    ["f5e2af", "f3c13d", "cba134", "a7832d"], ["a66547", "6e3837", "542c37", "45283a"],
                    ["f1ffc9", "bfffbd", "a8edfe", "a4cffe"], ["fff9cf", "f4d6bc", "eaaba8", "dc91b8"],
                    ["b77e4e", "88572e", "674426", "543a24"], ["c5af7a", "a6905c", "806d40", "69582e"],
                    ["a6705a", "8b4e35", "6c2e1c", "571d0e"], ["fa9292", "f55757", "e32b2b", "ca0e18"],
                    ["93aaff", "5778f5", "3a5ad2", "233fa8"], ["ffcf80", "ffb63e", "ff9300", "da7500"],
                    ["effeee", "def8dd", "cbf1c9", "b4d9b2"], ["cd41d9", "b309c0", "860d9e", "61067b"],
                    ["8cf5f8", "30e8ed", "18c9d4", "0798a6"]];
                    

// There's three types of palette:
// Foliage: Generally the bulk of a plant. Greens and browns are most common
// Feature: Think of the secondary on a dragon. Structures like trunks, flower brachts
// Accent: Think of the tertiary. Has bonus loud, bright colors that would look garish in a patch. Tone used for flowers (eventually)
var common_foliage_palettes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 21, 22, 23];
common_foliage_palettes = common_foliage_palettes.concat(common_foliage_palettes);  // Cheap greenery boost
var common_accent_palettes = [19, 20, 35, 36, 37, 38, 39, 40];
var common_feature_palettes = [20, 32, 33, 34];
var uncommon_palettes = [9, 10, 11, 12, 13, 14, 24, 25];
var rare_palettes = [15, 16,  17, 18, 26, 27, 28, 29, 30, 31];

/*common_foliage_palettes = [];
uncommon_palettes = [];
rare_palettes = [];
common_feature_palettes = [];
common_accent_palettes = [];*/

var uncommon_foliage_palettes = common_foliage_palettes.concat(uncommon_palettes);
var rare_foliage_palettes = uncommon_foliage_palettes.concat(rare_palettes);

var uncommon_feature_palettes = common_feature_palettes.concat(uncommon_palettes);
var rare_feature_palettes = uncommon_feature_palettes.concat(rare_palettes);

var uncommon_accent_palettes = common_accent_palettes.concat(uncommon_palettes);
var rare_accent_palettes = uncommon_accent_palettes.concat(rare_palettes);

// Universal use, removes chance of getting common palettes
var boosted_rare_palettes = uncommon_palettes.concat(rare_palettes);


async function place_image_at_coords_with_chance(img_url, list_of_coords, ctx, chance, anchor_to_bottom=false){
    // In canvas context ctx, place image at img_path "centered" at each (x,y) in list_of_coords with chance odds (ex 0.66 for 66%)
    // 50% chance to horizontally mirror each one? (TODO)
    // Wondering if the shared ctx save/reload and use of async-await is giving me the "floating flowers" issue in here.
    // I may revisit (and mirror the final canvas instead), but it feels like overkill for now.
    var img = new Image();
    img.src = img_url;
    img.crossOrigin = "anonymous"
    // closure to load an image because yes
    img.onload = (function(list_of_coords) {
      return function() {
      var w_offset = Math.floor(img.width/2);
      if(!anchor_to_bottom){
        var h_offset = Math.floor(img.height/2)-1;
      } else {
        var h_offset = -img.height + 1;
      }
      for (var i=0;i<list_of_coords.length;i++) {
        if (Math.random() < chance){
          [x,y] = list_of_coords[i];
          ctx.drawImage(img, x-w_offset, y+h_offset);
        }
      }
    }})(list_of_coords);
    await img.decode();
    return img;
}

async function preload_all_images()
// TODO: Gross prototype nonsense.
{
  refs = []
  lists_to_load = [all_foliage, all_features]
  for(var i=0; i<lists_to_load.length; i++){
      for(var j=0; j<lists_to_load[i].length;j++){
        var promise = preload_single_image(lists_to_load[i][j]);
        refs.push(promise);
      }
  }
  for(var i=0; i<refs.length; i++){
    await refs[i];
  }
  // to keep in memory
  return refs
}

// Sound of me not being 100% confident in my async usage yet
async function preload_single_image(url){
    var img=new Image();
    img.src=url;
    img.crossOrigin = "anonymous"
    return img
}

// We have things like foliage, colors, and features that exist in "master lists"
// These "master lists" comprise of everything in that category, regardless of rarity
// There's then sub-lists that contain the indices from the master list in each rarity category
// This function picks a random entry from a master, limited to what's allowed by the sublist.
function random_by_rarity(rarity_list, master_list) {
    var ep = rarity_list[Math.floor(Math.random()*rarity_list.length)];
    return master_list[ep];
}


// Rarity level:
// 0: only common things available
// 1: adds uncommon foliage
// 2: adds complex features, use common ones instead at lower rarities
// 3: adds uncommon foliage colors
// 4: adds uncommon feature colors
// 5: adds rare foliage
// 6: adds rare foliage colors
// 7: add rare feature colors
// 8: guarantees uncommon or rare feature color
// 9: guarantees uncommon or rare foliage color
// 10: guarantees uncommon or rare foliage
function gen_plant_data(rarity) {
    var available_foliage = common_foliage;
    var available_complex_features = simple_features;  // Needed to disable/enable complex features
    var available_foliage_palettes = common_foliage_palettes;
    var available_feature_palettes = common_feature_palettes;
    var available_accent_palettes = common_accent_palettes;

    // A bit grody ngl
    if(rarity>=1){available_foliage = uncommon_foliage;}
    if(rarity>=2){available_complex_features = complex_features;}
    if(rarity>=3){available_foliage_palettes = uncommon_foliage_palettes;}
    if(rarity>=4){
        available_feature_palettes = uncommon_feature_palettes;
        available_accent_palettes = uncommon_accent_palettes;
    }
    if(rarity>=5){available_foliage = rare_foliage;}
    if(rarity>=6){available_foliage_palettes = rare_foliage_palettes;}
    if(rarity>=7){
        available_feature_palettes = rare_feature_palettes;
        available_accent_palettes = rare_accent_palettes;
    }
    if(rarity>=8){available_feature_palettes = boosted_rare_palettes;}
    if(rarity>=9){available_foliage_palettes = boosted_rare_palettes;}
    if(rarity>=10){available_foliage = boosted_rare_foliage;}

    //available_foliage = override_foliage;
    return {"foliage": random_by_rarity(available_foliage, all_foliage),
            "simple_feature": random_by_rarity(simple_features, all_features),
            "complex_feature": random_by_rarity(available_complex_features, all_features),
            "foliage_palette": random_by_rarity(available_foliage_palettes, all_palettes),
            "feature_palette": random_by_rarity(available_feature_palettes, all_palettes),
            "accent_palette": random_by_rarity(available_accent_palettes, all_palettes)}
}

//seed format is 1<foliage><simple_feature><complex_feature>1<color><color><color><rngnum>
//random 1s are to avoid the encoding dropping the leading 0s
//foliage, feature, and the colors are all fixed-length 3 digits (ex: 100102310140060012147483647) for a max of 999 possibilities
//this number's way too big for Javascript without mantissa (Maxint is 9007199254740992 and we need highest precision and I don't know how Javascript does Things) so we break it like this:

// 1foliagesimplefeaturecomplexfeature-1colorcolorcolor-actualrandomnumberseed
// and then we put it in base64 for slightly-shorter-fixed-length purposes
function encode_plant_data() {}
function decode_plant_data() {}

async function gen_plant(plant_data) {
    // Returns the image data for a generated plant
    var work_canvas = document.createElement("canvas");
    var work_ctx=work_canvas.getContext("2d");
    work_canvas.width = work_canvas_size;
    work_canvas.height = work_canvas_size;
    /* How much base foliage to combine
    var foliage_amount;
    const foliage_roll = Math.random();
    if(foliage_roll < two_foliage_roll){
        foliage_amount = 1;
    } else {
        foliage_amount = 2;
    }
    // https://stackoverflow.com/questions/19269545/how-to-get-a-number-of-random-elements-from-an-array
    // TODO look up =>...probably not a cursed GTE :)
    var imgs = foliage.sort(() => .5 - Math.random()).slice(0,foliage_amount);
    var do_flip = false;
    for(var i=0;i<imgs.length;i++){
      if(Math.random() < 0.5){
        do_flip=true;
        work_ctx.save();
        //work_ctx.translate(work_canvas_size, 0);
        //work_ctx.scale(-1, 1);
      } else {do_flip=false};
      await place_image_at_coords_with_chance(imgs[i], [[Math.floor(work_canvas_size/2)-1, work_canvas_size-1]], work_ctx, 1, true);
    if(do_flip){work_ctx.restore();}
    }*/
    await place_image_at_coords_with_chance(plant_data["foliage"], [[Math.floor(work_canvas_size/2)-1, work_canvas_size-1]], work_ctx, 1, true);

    // Figure out where to put each kind of feature, replacing marker pixels as we go
    simple_feature_coords = get_marker_coords(place_simple_feature, work_ctx);
    complex_feature_coords = get_marker_coords(place_complex_feature, work_ctx);

    // Place the features
    if(simple_feature_coords.length > 0){
        var place_simple = place_image_at_coords_with_chance(plant_data["simple_feature"], simple_feature_coords, work_ctx, 0.5);
    }
    if(complex_feature_coords.length > 0){
        /* Chance that if there's already simple flowers, we keep using that flower
        if(simple_flower_coords.length == 0 || Math.random()>0.5){
            flower_url = complex_flowers[Math.floor(Math.random()*complex_flowers.length)];
        } else {*/
        var place_complex = place_image_at_coords_with_chance(plant_data["complex_feature"], complex_feature_coords, work_ctx, 0.8, true);
    }

    await place_simple
    await place_complex

    // We do all the recolors at once because Speed?(TM)?
    var new_overall_palette = plant_data["foliage_palette"].concat(plant_data["accent_palette"]).concat(plant_data["feature_palette"]);
    replace_color_palette(overall_palette, new_overall_palette, work_ctx);

    // We can draw a canvas directly on another canvas
    return work_canvas;
}

function hexToRgb(hex) {
  // taken from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}


function replace_color(old_rgb, new_rgb, ctx) {
    // `old_rgb` and `new_rgb`: (r, g, b)
    // taken from https://stackoverflow.com/questions/16228048/replace-a-specific-color-by-another-in-an-image-sprite
    var imageData = ctx.getImageData(0, 0, work_canvas_size, work_canvas_size);
    var oldRed, oldGreen, oldBlue;
    var newRed, newGreen, newBlue;
    [oldRed, oldGreen, oldBlue] = old_rgb;
    [newRed, newGreen, newBlue] = new_rgb;
    for (var i=0;i<imageData.data.length;i+=4)
      {
          // is this pixel the old rgb?
          if(imageData.data[i]==oldRed &&
             imageData.data[i+1]==oldGreen &&
             imageData.data[i+2]==oldBlue
          ){
              // change to your new rgb
              imageData.data[i]=newRed;
              imageData.data[i+1]=newGreen;
              imageData.data[i+2]=newBlue;
          }
      }
    // put the data back on the canvas  
    ctx.putImageData(imageData,0,0);
}

// Palettes MUST be the same length, FYI
function replace_color_palette(old_palette, new_palette, ctx) {
    var oldRGB, newRGB;
    // We do some truly hideous hacks because I'm bad at Javascript :)
    // Basically, we use the r, g, and b as a 3-level key into an object
    // If we follow it to the bottom and something exists, it's something we replace
    var paletteSwap = {};
    for(var i=0; i<old_palette.length; i++){
        oldRGB = hexToRgb(old_palette[i]);
        // (cries in defaultdict)
        // but seriously there might be a better way. As is, this stuff's prolly power word kill for JS devs...
        if(paletteSwap[oldRGB[0]] == undefined){paletteSwap[oldRGB[0]] = {};}
        if(paletteSwap[oldRGB[0]][oldRGB[1]] == undefined){paletteSwap[oldRGB[0]][oldRGB[1]] = {};}
        paletteSwap[oldRGB[0]][oldRGB[1]][oldRGB[2]] = hexToRgb(new_palette[i]);
    }
    // taken from https://stackoverflow.com/questions/16228048/replace-a-specific-color-by-another-in-an-image-sprite
    var imageData = ctx.getImageData(0, 0, work_canvas_size, work_canvas_size);
    for (var i=0;i<imageData.data.length;i+=4)
      {
          // god this is painful to look at. I'm sorry.
          if(paletteSwap[imageData.data[i]] != undefined &&
             paletteSwap[imageData.data[i]][imageData.data[i+1]] != undefined &&
             paletteSwap[imageData.data[i]][imageData.data[i+1]][imageData.data[i+2]] != undefined){
              newRGB = paletteSwap[imageData.data[i]][imageData.data[i+1]][imageData.data[i+2]];
              imageData.data[i]=newRGB[0];
              imageData.data[i+1]=newRGB[1];
              imageData.data[i+2]=newRGB[2];
          }
      }
    // put the data back on the canvas  
    ctx.putImageData(imageData,0,0);
}

function get_marker_coords(marker_hex, ctx) {
    // Go through an image and find where to place features. Very similar to replace_color().
    // NOTE: replaces marker pixels with base_foliage ones! This is because we don't always
    // place features and don't want a pixel escaping.
    var ret_coords = [];
    var imageData = ctx.getImageData(0, 0, work_canvas_size, work_canvas_size);
    [oldRed, oldGreen, oldBlue] = hexToRgb(marker_hex);
    [newRed, newGreen, newBlue] = hexToRgb(base_foliage_palette[1]);
    var pixel = 0;
    for (var i=0;i<imageData.data.length;i+=4)
      {
          // is this pixel the old rgb?
          if(imageData.data[i]==oldRed &&
             imageData.data[i+1]==oldGreen &&
             imageData.data[i+2]==oldBlue
          ){
              // change to your new rgb
              imageData.data[i]=newRed;
              imageData.data[i+1]=newGreen;
              imageData.data[i+2]=newBlue;
              // Ready to get a little cursed? Because there's probably a better way to do this, but it's a dumb project so...
              pixel = i/4;
              ret_coords.push([pixel%work_canvas_size, Math.floor(pixel/work_canvas_size)]);
          }
      }
    ctx.putImageData(imageData,0,0);
    return ret_coords
  }
