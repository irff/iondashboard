var frequency_list
var keys
var FONT_MAX_SIZE = 170;

d3.json("../../static/js/words.json", function(error, data) {
    console.log(data.result[0].media)
    tmp = data.result[0].media;
    keys = Object.keys(tmp);
    max = -1;
    total = 0
    for (var i = 0;i<keys.length;++i){
        total += tmp[keys[i]]
        if(max < tmp[keys[i]]){
            max = +tmp[keys[i]]
        }
    }
    //console.log(scale_font)

    //set max as the pivot value
    font_scale =  1/(max/FONT_MAX_SIZE);

    //set mean as the pivot value
    //font_scale = total / keys.length

    //set median as the pivot value
    //font_scale = tmp[keys[keys.length/2 + 1]]

    //console.log(scaled_font2)
    frequency_list = []

    for (var i = 0;i<keys.length;++i) {
        frequency_list.push({ text: keys[i], size: ((tmp[keys[i]]*font_scale))});
        console.log(keys[i]+" "+((tmp[keys[i]]*font_scale)))
    };

    console.log(frequency_list);

    var color = d3.scale.linear()
            .domain([0,1,2,3,4,5,6,10,15,20,100])
            .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

    d3.layout.cloud().size([800, 300])
            .words(frequency_list)
            .rotate(0)
            .fontSize(function(d) { return d.size; })
            .on("end", draw)
            .start();

    function draw(words) {
        d3.select("#result").append("svg")
                .attr("width", 850)
                .attr("height", 350)
                .attr("class", "wordcloud")
                .append("g")
                // without the transform, words words would get cutoff to the left and top, they would
                // appear outside of the SVG area
                .attr("transform", "translate(320,200)")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .style("fill", function(d, i) { return color(i); })
                .attr("transform", function(d) {
                    console.log(d.text+" "+d.x + " "+d.y);
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
    }
})