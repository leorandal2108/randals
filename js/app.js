const menuContainer = document.getElementById("menuContainer");
const categoryBar = document.getElementById("categoryBar");
const searchBox = document.getElementById("search");

let menu = [];

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

function renderCategories(data){

    const categories = [...new Set(data.map(item => item.category))];

    categoryBar.innerHTML = "";

    categories.forEach(category=>{

        const btn = document.createElement("button");

        btn.className="category";

        btn.innerText=category;

        btn.onclick=()=>{

            document
                .getElementById(category.replace(/\s/g,""))
                .scrollIntoView({
                    behavior:"smooth"
                });

        };

        categoryBar.appendChild(btn);

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