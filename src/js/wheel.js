const userData = [
    {
        "name": "Dinars",
        "ytAccount": "https://www.youtube.com/@MorePlatesMoreDates"
    },
    {
        "name": "Janka",
        "ytAccount": "https://www.youtube.com/@MorePlatesMoreDates"
    },
    {
        "name": "Bomis",
        "ytAccount": "https://www.youtube.com/@MorePlatesMoreDates"
    },
    {
        "name": "Bordza",
        "ytAccount": "https://www.youtube.com/@MorePlatesMoreDates"
    },
    {
        "name": "benaars",
        "ytAccount": "https://www.youtube.com/@MorePlatesMoreDates"
    },
    {
        "name": "slotmaster",
        "ytAccount": "https://www.youtube.com/@MorePlatesMoreDates"
    },
];

// DOM ELEMENTS
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.closeBtn');
let userCount = userData.length;

// DATA
let data = getData(userCount);

// PURE FUNCTIONS
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// SYNC FUNCTIONS
function render() {
    const padding = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 500 - padding.left - padding.right;
    const height = 500 - padding.top - padding.bottom;
    const radius = Math.min(width, height) / 2;
    const spins = 3;
    const degrees = spins * 360;
    const color = d3.scaleOrdinal(["#e5dff6", "#e5f6df", "#dfe5f6", "#ebd4f3", "#f6f0df"]);
    let counter = 0;
    let picked = 1000;

    let fontSize;
    if(userCount >= 20) {
        fontSize = '12px';
    }

    if(userCount >= 40) {
        fontSize = '10px';
    }

    if(userCount >= 60) {
        fontSize = '9px';
    }

    if(userCount >= 80) {
        fontSize = '9px';
    }

    if(userCount >= 100) {
        fontSize = '8px';
    }

    if(userCount >= 120) {
        fontSize = '7px';
    }

    if (userCount >= 140) {
        fontSize = '6px';
    }

    if(userCount >= 150) {
        fontSize = '4.5px';
    }

    let svg = d3.select('#chart').selectAll('svg').data([null]);
    svg = svg
        .enter().append('svg')
        .merge(svg)
        .data([data])
        .attr('width', 500)
        .attr('height', 500);

    const container = svg.append('g')
        .attr('class', 'chartcontainer')
        .attr('transform', `translate(${width / 2 + padding.left},${height / 2 + padding.top})`);

    const wheel = container.append('g')
        .attr('class', 'wheel');

    const pie = d3.pie().sort(null).value(function (d) { return 1; });

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const arcs = wheel.selectAll('g.slice')
        .data(pie)
        .enter()
        .append('g')
        .attr('class', 'slice');

    arcs.append('path')
        .attr('fill', function (d, i) { return color(i); })
        .attr('d', function (d) { return arc(d); });

    arcs.append("text").attr("transform", function (d) {
        d.innerRadius = 0;
        d.outerRadius = radius;
        d.angle = (d.startAngle + d.endAngle) / 2;
        return `rotate(${(d.angle * 180 / Math.PI - 90)})translate(${d.outerRadius - 10})`;
    })
        .attr("text-anchor", "end")
        .text(function (d, i) {
            return data[i].name;
        })
        .style('font-size', fontSize);

    // arrow
    svg.append('g')
        .attr('class', 'arrow')
        .attr('transform', `translate(${(width + padding.left + padding.right) / 2 - 15}, 12)`)
        .append('path')
        .attr('d', `M0 0 H30 L 15 ${Math.sqrt(3) / 2 * 30}Z`)
        .style('fill', '#000809');

    // push button
    const push = d3.select('#push');

    push.on('click', spin);

    // FUNCTIONS
    function spin(d) {
        counter++;

        const piedegree = 360 / data.length;
        const randomAssetIndex = getRandomInt(0, data.length);
        const randomPieMovement = getRandomInt(1, piedegree);

        rotation = (data.length - randomAssetIndex) * piedegree - randomPieMovement + degrees;

        wheel.transition()
            .duration(8000)
            .attrTween('transform', rotTween)
            .ease(d3.easeCircleOut)
            .on('end', function () {

                let result = d3.select('#result').data([null]);
                result = result
                    .enter()
                    .append('text')
                    .attr('class', 'result')
                    .merge(result)
                    .text(data[randomAssetIndex].name)
                    .style('font-size', '30px')
                    .style('font-weight', '700');


                let name = d3.select('.spin-result-name').data([null]);
                name = name
                    .enter()
                    .append('text')
                    .attr('class', '')
                    .merge(name)
                    .text(` ${userData[randomAssetIndex].name}`)

                let yt = d3.select('.spin-result-yt').data([null]);
                yt = yt
                    .enter()
                    .append('text')
                    .merge(yt)
                    .text(` ${userData[randomAssetIndex].ytAccount}`)

                let details = d3.select('#modal').data([null]);
                details = details
                    .enter()
                    .merge(details)
                    .style('display', 'block');
            });
    }

    function rotTween() {
        let i = d3.interpolate(0, rotation);
        return function (t) {
            return `rotate(${i(t)})`;
        };
    }
}

function getData(value) {
    let array = [];

    for (let i = 0; i < value; i++) {
        array.push(userData[i]);
    }

    return array;
}

function closeModal() {
    modal.style.display = 'none';
}

function outsideClick(e) {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
}

// EVENT LISTENERS
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);
window.onload = render;