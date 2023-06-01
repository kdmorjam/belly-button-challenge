const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let dropdown;
let optSample;

//var OTUdata = d3.json(url).then((data) => console.log(data.samples[0]));
d3.json(url).then((sample) => {
    //dropdown list values
    dropdown = sample.names;
    //display test subject id dropdown
    displayOptions(dropdown);
    
    //display default  demographic and charts (using first sample, index 0)
    displayData(sample, 0, -1);

    optSample = sample;
    // On change to the DOM, call optionChanged()
    d3.select("#selDataset").on("change", optionChanged(this.value));

});


function displayData(default_sample, index, flag){
    //get data for chart
    let chart_data = getChartData(default_sample.samples[index]);
    
    //plot chart
    //plotOTU(vals,otu_lbl,y_otu,otuids);
    plotOTU(chart_data,flag);
    
    //plot bubble chart
    plotBubble(chart_data,flag);
    //print matadata for default
    getSampleMeta(default_sample.metadata[index], flag);

}


//get info for chart
function getChartData(option_data){
    //we only need to top ten values
    let limit = 9; 
    //initailizing return variables
    let sample_vals = []
    let otu_ids = []
    let otu_labels = []
    let y_otulabel = []


    //load arrays for sample value, out_ids, otu_labels
    for(let i = 0; i <= limit;i++){
        sample_vals.push(option_data.sample_values[i]);
        y_otulabel.push(`OTU`+option_data.otu_ids[i]);
        otu_ids.push(option_data.otu_ids[i]);
        otu_labels.push(option_data.otu_labels[i]);
    }
      
    return [sample_vals, y_otulabel, otu_ids, otu_labels]
}


//plot OTU chart for sample id
function plotOTU(chart_data, indicator){
    //assigning variables for clarity
    let values = chart_data[0];         //sample_values
    let y_otulabel = chart_data[1];     //otu_ids prefaced with 'OTU'
    let otu_lbl = chart_data[3];        //otu_labels


    let trace = {
        x: values,
        y: y_otulabel,
        hovertext: otu_lbl, 
        type:`bar`,
        orientation: `h`,
        marker:{
            width: 1
        }
    }

    //reverse order for y-axis
    let layout = {
        yaxis:{
            autorange:'reversed'
        }
    }
    if (indicator == -1){
        //create default plot
        Plotly.newPlot("bar",[trace],layout);
    }
    else {
        //create updated plot
        Plotly.react("bar",[trace],layout);
    };

}

//plot bubble chart for sample id
function plotBubble(chart_data,indicator){
     //assigning variables for clarity
     let values = chart_data[0];    //sample_values
     let otuids = chart_data[2];    //out_ids
     let otu_lbl = chart_data[3];   //otu_labels
    let trace2 = {
        x: otuids,
        y: values,
        text: otu_lbl,
        mode: 'markers',
        marker: {
          size: values,
          color: otuids
        }
    };

    if (indicator == -1){
        //create default plot
        Plotly.newPlot("bubble",[trace2]);
    }
    else{
        //create updated plot
        Plotly.react("bubble",[trace2]);
    }
    
}

//get sample-metadata for sample id
function getSampleMeta(metadata, indicator){
    //create list of keys & values from metadata
    let metakeys = Object.keys(metadata);
    let metavalues = Object.values(metadata);
    //console.log(metakeys.length);

    // Use D3 to select the sample-metadata id
    let meta = d3.select("#sample-metadata");
    
    //if option changed, remove previous tags
    if (indicator == 1) {
        d3.selectAll("tr").remove();
        d3.select("tbody").remove();
    }

    // Append table body
    let table = meta.append("tbody");
    
    for(let i = 0; i < metakeys.length;i++){
        //append row for each meta data information
        table.append("tr").text(`${metakeys[i]} ${metavalues[i]}`);
    }
}

//display drop down list of sample IDs
function displayOptions(sampleids){
    //use D3 to select the selDataset id 
    let listoptions = d3.select("#selDataset");

    for(let i = 0; i < sampleids.length;i++){
        //append option
        listoptions.append("option").text(`${sampleids[i]}`).property(`${sampleids[i]}`);
    }

}

//update charts and demography based on change selected
function optionChanged(value){
    //get index position in JSON using the names array
    optionIndex = getIndex(value);
    //display demography and charts for option selected
    displayData(optSample, optionIndex, 1);

}

//get index of position using names array
function getIndex(optvalue){
    //let optIndex = optSample.names.indexOf(optvalue);
    return optSample.names.indexOf(optvalue)
}