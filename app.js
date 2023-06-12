
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
 
d3.json(url).then(function(data) {console.log(data);}).catch(error => {console.error(error);});

function myMetadata(subject) {
  d3.json(url).then((data) => {
    const metadata = data.metadata; 
    let resultArray = metadata.filter(subjectSample => subjectSample.id == subject);
    let result = resultArray[0];
    let PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    for (key in result){
      PANEL.append("h6").text(`${key}: ${result[key]}`);
    };
  }).catch(error => {console.error(error);});
}

function myGraphs(subject) {
  d3.json(url).then((data) => {
    const samples = data.samples;
    let resultArray = samples.filter(subjectSample => subjectSample.id == subject);
    let result = resultArray[0];
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;
    

    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    const barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];
    const barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);

    const bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];
    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
 
  }).catch(error => {console.error(error);});
}

function init() {
  let dropdown = d3.select("#selDataset");
  d3.json(url).then((data) => {
    let subjectIds = data.names;
    for (let i = 0; i < subjectIds.length; i++){
      dropdown
        .append("option")
        .text(subjectIds[i])
        .property("value", subjectIds[i]);
    };
   const firstID = subjectIds[0];
    myGraphs(firstID);
    myMetadata(firstID);
  }).catch(error => {console.error(error);});
}

function optionChanged(newSubject) {
  myMetadata(newSubject);
  myGraphs(newSubject);
}
init();