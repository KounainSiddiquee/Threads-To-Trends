console.log("Threads To Trends Intelligence Loaded");

let allBusinesses = [];
let mapLoaded = false;


// Global Chart Theme

Chart.defaults.color = "#d8d2e5";
Chart.defaults.font.family = "Poppins";


// Initialize App

document.addEventListener("DOMContentLoaded", () => {

    createCharts();

    fetch("/api/businesses")
        .then(response => response.json())
        .then(data => {

            allBusinesses = data;

            showBusinesses(data.slice(0, 12));
            showTopOpportunities();
            createSearchSuggestions();

        });

});


// Charts

function createCharts(){

    createWebsiteChart();
    createSegmentChart();
    createScatterChart();

}


function createWebsiteChart(){

    const chart = document.getElementById("websiteChart");

    if(!chart) return;


    new Chart(chart,{

        type:"doughnut",

        data:{

            labels:websiteData.labels,

            datasets:[{

                data:websiteData.values,

                backgroundColor:[
                    "#B983FF",
                    "#FFD166"
                ],

                borderWidth:0
            }]
        },


        options:{

            responsive:true,

            maintainAspectRatio:false,

            cutout:"72%"

        }

    });

}



function createSegmentChart(){

    const chart =
    document.getElementById("segmentChart");


    if(!chart) return;


    new Chart(chart,{

        type:"bar",


        data:{

            labels:segmentData.labels,


            datasets:[{

                data:segmentData.values,

                borderRadius:18,


                backgroundColor:[

                    "#B983FF",
                    "#FFD166",
                    "#FF8FAB",
                    "#8EE4AF"

                ]

            }]

        },


        options:{

            maintainAspectRatio:false,


            plugins:{

                legend:{
                    display:false
                }

            }

        }

    });

}



// Page Navigation

function showSection(sectionId){


    document
    .querySelectorAll(".page-section")
    .forEach(section=>{

        section.classList.remove("active");

    });


    document
    .getElementById(sectionId)
    .classList.add("active");



    document
    .querySelectorAll(".sidebar a")
    .forEach(link=>{

        link.classList.remove("active");

    });



    event.currentTarget
    .classList.add("active");

if(sectionId==="locationSection"){

    loadLocations();
    loadLocationSummary();

    setTimeout(()=>{

        loadMap();

    },400);

}


    if(sectionId==="insightSection"){

        loadExecutive();
        loadSummary();

    }
    if(sectionId==="digitalSection"){

    loadDigitalGap();

    }
}






// Business Card Design

function businessTemplate(item){


return `

<div class="business-card"
onclick="openBusiness('${item.Name}')">

    <h3>${item.Name}</h3>

    <div class="card-top">

        <span>⭐ ${item["Average Rating"] || "N/A"}</span>

        <span>📍 ${item.Municipality || "Unknown"}</span>

    </div>

    <div class="card-status">

        <span class="${
            item.Has_Website==1
            ? "active"
            : "missing"
        }">

            🌐 ${
                item.Has_Website==1
                ? "Website"
                : "No Website"
            }

        </span>

        <span class="${
            item.Has_Instagram==1
            ? "active"
            : "missing"
        }">

            📸 ${
                item.Has_Instagram==1
                ? "Instagram"
                : "No Instagram"
            }

        </span>

    </div>

    <div class="score-row">

        <h2>
            🔥 ${item.Opportunity_Score}%
        </h2>
<span class="priority ${
(item.Growth_Priority || "").includes("High")
? "high"
: (item.Growth_Priority || "").includes("Medium")
? "medium"
: "low"
}">
            ${item.Growth_Priority}

        </span>

    </div>

</div>

`;
}
function showBusinesses(data){

    const container =
    document.getElementById("businessContainer");

    if(!container) return;

    container.innerHTML = data
        .map(item => businessTemplate(item))
        .join("");

}
// Search Suggestions + Filters

function createSearchSuggestions(){

    let input = document.getElementById("searchInput");

    if(!input) return;

    let list = document.createElement("datalist");

    list.id = "businessSuggestions";

    allBusinesses.forEach(item=>{

        let option = document.createElement("option");
        option.value = item.Name;

        list.appendChild(option);

    });


    document.body.appendChild(list);

    input.setAttribute(
        "list",
        "businessSuggestions"
    );

}



function applyFilters(){

    let result = [...allBusinesses];


    let search =
    document.getElementById("searchInput")
    ?.value.toLowerCase();



    let website =
    document.getElementById("websiteFilter")
    ?.value;



    let priority =
    document.getElementById("priorityFilter")
    ?.value;



    if(search){

        result =
        result.filter(item=>

            item.Name
            .toLowerCase()
            .includes(search)

        );

    }



    if(website==="missing"){

        result =
        result.filter(
            item=>item.Has_Website==0
        );

    }



    if(website==="available"){

        result =
        result.filter(
            item=>item.Has_Website==1
        );

    }



    if(priority){

        result =
        result.filter(item=>

            item.Growth_Priority
            ?.includes(priority)

        );

    }



    showBusinesses(result);

}



document.addEventListener("input",e=>{


    if(e.target.id==="searchInput"){

        applyFilters();

    }


    if(e.target.id==="opportunitySearch"){

        searchOpportunity(e.target.value);

    }


});




// Opportunity Section


function showOpportunityCards(data){


const box =
document.getElementById("opportunityContainer");


if(!box) return;


box.innerHTML =

data.map(item=>`

<div class="opportunity-card">

<h3>
🔥 ${item.Name}
</h3>


<p>
⭐ Rating : ${item["Average Rating"]}
</p>


<p>
📊 Digital Score : ${item.Digital_Score}/100
</p>


<h4>
🚀 ${item.Opportunity_Score}%
</h4>


<p>
🤖 ${
item.AI_Recommendation ||
"Improve online visibility"
}
</p>


</div>


`).join("");

}




function showTopOpportunities(){


let result =

[...allBusinesses]

.sort(
(a,b)=>

b.Opportunity_Score -
a.Opportunity_Score

)

.slice(0,20);



showOpportunityCards(result);


}





function showWebsiteMissingLeads(){


let result =

allBusinesses.filter(

item=>item.Has_Website==0

);



showOpportunityCards(result);

}



function searchOpportunity(text){
let result =
allBusinesses.filter(item=>
item.Name.toLowerCase()
.includes(
text.toLowerCase()
)
);
showOpportunityCards(result);
}
// Premium Business Modal
function openBusiness(name){

let business = allBusinesses.find(
x => x.Name === name
);

if(!business) return;

let index = allBusinesses.indexOf(business);

document.getElementById("modalContent").innerHTML = `

<button class="close" onclick="closeModal()">
×
</button>

<h2>
💎 ${business.Name}
</h2>

<p>
📍 ${business["Full Address"] || business.Municipality}
</p>

<hr>

<h3>
📊 Digital Intelligence
</h3>

<p>
⭐ Rating : ${business["Average Rating"]}
</p>

<p>
🌐 Website :
${business.Has_Website==1 ? "Active" : "Missing"}
</p>

<p>
📸 Instagram :
${business.Has_Instagram==1 ? "Active" : "Missing"}
</p>

<h3>
Digital Score
</h3>

<div class="score-bar">

<div style="
width:${business.Digital_Score}%
">
</div>

</div>

<h2>
🚀 Opportunity :
${business.Opportunity_Score}%
</h2>

<p>
⚠️ Risk :
${business.Digital_Risk || "Analyzed"}
</p>

<h3>
🤖 AI Growth Plan
</h3>

<p>
${business.AI_Recommendation}
</p>

<h3>
📅 Roadmap
</h3>

<p>
${business.Growth_Roadmap}
</p>

<button onclick="downloadPDF(${index})">
Download AI Audit
</button>

`;

document
.getElementById("businessModal")
.style.display="flex";

}


function closeModal(){

document
.getElementById("businessModal")
.style.display="none";

}
// Map System

function loadMap(){


    if(mapLoaded) return;


    let mapBox =
    document.getElementById("map");


    if(!mapBox) return;



    let map =
    L.map("map")
    .setView(
        [22.7196,75.8577],
        12
    );



    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {
            attribution:
            "Threads To Trends Intelligence"
        }

    )
    .addTo(map);



    fetch("/api/map")

    .then(response=>response.json())

    .then(data=>{


        data.forEach(item=>{


            if(
                item.Latitude &&
                item.Longitude
            ){


                L.marker([

                    item.Latitude,
                    item.Longitude

                ])

                .addTo(map)

                .bindPopup(`


                <b>
                ${item.Name}
                </b>

                <br>

                ⭐ Rating :
                ${item["Average Rating"]}

                <br>

                🚀 Opportunity :
                ${item.Opportunity_Score}%


                `);

            }


        });


    });


setTimeout(()=>{

    map.invalidateSize();

},1000);



    mapLoaded=true;

}






// Scatter Analysis Chart

function createScatterChart(){

    const canvas =
    document.getElementById(
        "scatterChart"
    );


    if(!canvas) return;


    fetch("/api/scatter")

    .then(res=>res.json())

    .then(data=>{


        new Chart(canvas,{


            type:"scatter",


            data:{


                datasets:[{

                    label:
                    "Growth Opportunity",

                    data:data,

                    backgroundColor:
                    "#FFD166",

                    borderColor:
                    "#B983FF",

                    pointRadius:6,

                    pointHoverRadius:10

                }]

            },


            options:{


                maintainAspectRatio:false,


                plugins:{

                    legend:{

                        labels:{

                            color:"#fff"

                        }

                    }

                },


                scales:{


                    x:{

                        title:{

                            display:true,

                            text:"Customer Rating"

                        }

                    },


                    y:{

                        title:{

                            display:true,

                            text:"Opportunity Score"

                        }

                    }


                }


            }


        });


    });

}





// Executive Insights


function loadExecutive(){


let box =
document.getElementById("executiveBox");


if(!box) return;


box.innerHTML = `


<div class="insight-card">
<h3>
🤖 AI Market Analysis
</h3>


<p>
Analyzed ${allBusinesses.length}+ businesses using digital signals.
</p>


<p>
Detected website gaps, growth opportunities and hidden potential businesses.
</p>


<h4>
🚀 Strategy Ready
</h4>


</div>


<div class="insight-card">
<h3>
📊 Reports
</h3>


<p>
Generate investor style intelligence presentation.
</p>


<button 
class="report-btn"
onclick="downloadPPT()">
📊 Download Premium PPT

</button>


</div>


`;

}






function loadSummary(){


let box =
document.getElementById("summaryBox");


if(!box) return;


let missing =

allBusinesses.filter(

x=>x.Has_Website==0

).length;



box.innerHTML = `


<div class="insight-card">

<h3>
📌 Consultant Summary
</h3>


<p>
Businesses Studied :
${allBusinesses.length}
</p>


<p>
Digital Gap Found :
${missing} businesses
</p>


<p>
AI suggests website creation,
SEO improvement and social growth campaigns.
</p>


</div>


`;

}






// Reports Download


function downloadPDF(id){


    window.open(
        "/api/pdf/"+id,
        "_blank"
    );


}



function downloadPPT(){


    window.open(
        "/api/ppt",
        "_blank"
    );


}
function loadDigitalGap(){

let box=document.getElementById("digitalSection");

let missing=
allBusinesses.filter(x=>x.Has_Website==0).length;

let social=
allBusinesses.filter(x=>x.Has_Instagram==0).length;

let avg=
allBusinesses.reduce((a,b)=>a+b.Digital_Score,0)
/allBusinesses.length;

let high=
allBusinesses.filter(x=>x.Opportunity_Score>=80).length;

box.innerHTML=`

<h2>🌐 Digital Gap Intelligence</h2>

<p class="page-insight">
💡 AI analysis indicates that missing websites remain the largest contributor to poor digital maturity among fashion businesses. High-rated boutiques without websites represent the strongest growth opportunities.
</p>

<div class="business-grid">

<div class="digital-card">
<h3>🌐 Website Missing</h3>
<h4>${missing}</h4>
<p>Businesses currently operating without a website.</p>
</div>

<div class="digital-card">
<h3>📸 Instagram Missing</h3>
<h4>${social}</h4>
<p>Businesses requiring stronger social visibility.</p>
</div>

<div class="digital-card">
<h3>📊 Average Digital Score</h3>
<h4>${avg.toFixed(1)}/100</h4>
<p>Overall digital maturity across all boutiques.</p>
</div>

<div class="digital-card">
<h3>🚀 High Priority Leads</h3>
<h4>${high}</h4>
<p>Businesses ready for immediate digital transformation.</p>
</div>

<div class="digital-card">
<h3>💰 Lost Opportunity</h3>
<h4>${missing}</h4>
<p>These businesses may lose online visibility due to the absence of a website.</p>
</div>

<div class="digital-card">
<h3>🎯 AI Recommendation</h3>
<h4>Website + SEO</h4>
<p>Prioritize website development, Google Business optimization and social media marketing.</p>
</div>

</div>

`;

}


// Location Intelligence

function loadLocations(){

    fetch("/api/locations")

    .then(response => response.json())

    .then(data => {


        let container =
        document.getElementById("locationContainer");


        if(!container) return;


        let html = "";

data.forEach(area=>{

html += `

<div class="location-card">

<h3>📍 ${area.Municipality}</h3>

<p>🏪 ${area.Businesses} Businesses</p>

<p>⭐ ${area.Avg_Rating}</p>

<p>🌐 Digital Score : ${area.Avg_Digital}/100</p>

<h4>🚀 ${area.Avg_Opportunity}%</h4>

<span>
High Growth Zone
</span>

</div>

`;

});

container.innerHTML = html;


    });

}
function loadLocationSummary(){

fetch("/api/location-summary")

.then(res=>res.json())

.then(data=>{

document.getElementById("marketZones")
.innerText = data.zones;

document.getElementById("topArea")
.innerText = data.top_area;

});

}
async function loadExecutiveSummary(){

    const res =
        await fetch("/api/executive-summary");

    const data =
        await res.json();

    document
        .getElementById("executiveSummary")
        .innerText =
        data.summary;

}

loadExecutiveSummary();