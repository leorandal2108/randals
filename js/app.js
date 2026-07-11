const menuContainer = document.getElementById("menuContainer");
const categoryBar = document.getElementById("categoryBar");
const searchBox = document.getElementById("search");
const loader = document.getElementById("loader");

let menu = [];
const SHEET_ID = "1IjUIZeVz-wxmtruI6-fl1Z98OUKB-SG8ASCkNqgsE6E";
const SHEET_NAME = "Sheet1";

const url =
`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

loadMenu();
/*
fetch("data/menu.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Unable to load menu.json");
        }
        return response.json();
    })
    .then(data => {
        menu = data;
        renderMenu(menu);
        renderCategories(menu);
        enableActiveCategory();

        document.getElementById("loader").style.display = "none";
    })
    .catch(err => {

        console.error(err);

        document.getElementById("loader").style.display = "none";

        menuContainer.innerHTML =
        `
        <div style="padding:50px;text-align:center">
            <h2>Unable to load menu.</h2>
            <p>Run the website using Live Server or a local web server.</p>
        </div>
        `;
    });
*/
function renderCategories(data) {

    const categories = [...new Set(data.map(item => item.category))];

    categoryBar.innerHTML = "";

    categories.forEach((category, index) => {

        const btn = document.createElement("button");

        btn.className = "category";

        // Store the section id for later use
        btn.dataset.category = category.replace(/\s/g, "");

        btn.innerText = category;

        // Highlight the first category by default
        if (index === 0) {
            btn.classList.add("active");
        }

        btn.addEventListener("click", () => {

            // Remove active class from all buttons
            document.querySelectorAll(".category").forEach(b => {
                b.classList.remove("active");
            });

            // Highlight clicked button
            btn.classList.add("active");

            // Scroll to the section
            document
                .getElementById(btn.dataset.category)
                .scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

        });

        categoryBar.appendChild(btn);

    });

}

function enableActiveCategory() {

    const sections = document.querySelectorAll(".menu-section");
    const buttons = document.querySelectorAll(".category");

    let current = "";

    window.addEventListener("scroll", () => {

        const scrollPos = window.scrollY + 220;

        sections.forEach(section => {

            if (scrollPos >= section.offsetTop) {
                current = section.id;
            }

        });

        buttons.forEach(btn => {

            btn.classList.toggle(
                "active",
                btn.dataset.category === current
            );

        });

    });

}

function renderMenu(data){

    menuContainer.innerHTML="";

    const categories=[...new Set(data.map(item=>item.category))];

    categories.forEach(category=>{

        const section=document.createElement("section");

        section.className="menu-section";

        section.id=category.replace(/\s/g,"");

        section.innerHTML=`<h2>${category}</h2>`;

        const grid=document.createElement("div");

        grid.className="menu-grid";

        data
        .filter(item=>item.category===category)
        .forEach(item=>{

            const card=document.createElement("div");

            card.className="menu-card";

            card.innerHTML=`

                <img src="${item.image}" alt="${item.name}">

                <div class="card-content">

                    <div class="food-name">${item.name}</div>

                    <div class="food-desc">${item.description}</div>

                    <div class="food-bottom">

                        <div class="price">

                            ₹${item.price}

                        </div>

                    </div>

                </div>

            `;

            grid.appendChild(card);

        });

        section.appendChild(grid);

        menuContainer.appendChild(section);

    });

}

searchBox.addEventListener("input",function(){

    const text=this.value.toLowerCase();

    const filtered=menu.filter(item=>

        item.name.toLowerCase().includes(text) ||

        item.category.toLowerCase().includes(text) ||

        item.description.toLowerCase().includes(text)

    );

    renderMenu(filtered);

});

/* ================= GO TO TOP ================= */

const goTopBtn = document.getElementById("goTopBtn");

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        goTopBtn.style.display = "flex";

    } else {

        goTopBtn.style.display = "none";

    }

});

goTopBtn.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

async function loadMenu() {

    try {

        const response = await fetch(url);

        const text = await response.text();

        const json = JSON.parse(
            text.substring(47, text.length - 2)
        );

        menu = parseGoogleSheet(json);

        renderCategories(menu);

        renderMenu(menu);

        enableActiveCategory();   // <-- changed

        loader.style.display = "none";

    }
    catch(err){

        console.error(err);

        loader.style.display = "none";

    }

}

function parseGoogleSheet(json){

    const cols = json.table.cols.map(c => c.label);

    return json.table.rows.map(row => {

        const obj = {};

        cols.forEach((col, index) => {

            obj[col] = row.c[index] ? row.c[index].v : "";

        });

        obj.price = Number(obj.price);

        return obj;

    });

}