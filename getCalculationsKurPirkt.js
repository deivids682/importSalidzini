const axios = require('axios');

module.exports.getXml = async function () {
    return new Promise(async resolve => {
        try {

            let counts =  await getProductsCount();
             /// 250;
            let pages = Math.ceil(counts.count / 250);

            
            let prom = [];
            for (let i = 1; i <= pages; i++) {
                prom.push(getProducts(i));
                
            }

            let promProducts = await Promise.all(prom);

            let object3 = [];
            for (let i = 0; i < pages; i++) {
                let object = promProducts[i];
                let array = [...object3];
                object3 = array.concat(object.products);
                
            }

           
            let smartColections = getSmartColections();

            let product = await Promise.all([smartColections]);
            let xml = {};

            let cats = product[0]['custom_collections'];

            object3.forEach(item => {

                const [cat1, color] = item.product_type.split("-");

                let l = cats.find(element => element.title.toLowerCase() === item.tags.toLowerCase());

                xml[item.id] = {};
                xml[item.id]['title'] = item.title;
                xml[item.id]['vendor'] = item.vendor;
                xml[item.id]['cat'] = l !== undefined ? l.handle : null;
                xml[item.id]['fullCat'] = `${cat1} &gt; ${item.tags}`;
                xml[item.id]['tags'] = item.tags;
                xml[item.id]['productLink'] = `https://viedierices.lv/collections/${xml[item.id].cat}/products/${item.handle}`
                xml[item.id]['catLink'] = `https://viedierices.lv/collections/${xml[item.id].cat}`
                xml[item.id]['imgSrc'] = item.images[0] !== undefined ? item.images[0].src : null;
                xml[item.id]['price'] = item.variants[0].price;
                xml[item.id]['model'] = item.variants[0].barcode;
                xml[item.id]['color'] = color || "nav";
            });
     
            let xmlStr = "";
            for (const id in xml) {
                const p = xml[id];
                xmlStr += `<item>
                            <name>${p.title || "nav"}</name>
                            <link>${p.productLink || "nav"}</link>
                            <price>${p.price || "nav"}</price>
                            <image>${p.imgSrc || "nav"}</image>
                            <category>${p.cat || "nav"}</category>
                            <category_full>${p.fullCat || "nav"}</category_full>
                            <category_link>${p.catLink || "nav"}</category_link>
                            <manufacturer>${p.vendor || "nav"}</manufacturer>
                            <model>${p.model || "nav"}</model> 
                        </item>`;
            }

            let xmlString =
                `<?xml version="1.0" encoding="utf-8" ?>
                <root>
                ${xmlStr}
                </root>`;

            resolve(xmlString);
        } catch (error) {
            console.log(error);
        }
    });
};

async function getProductsCount() {
    return new Promise(async resolve => {
        try {
            const URL = 'https://c53d4fa996c9f9018788913d6729a7c1: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@viedierices-lv.myshopify.com/admin/products/count.json';
            let viedierices = axios.get(URL)
                .then(response => {
                    return response.data
                })
                .catch(err => {
                    return err;
                });

            resolve(viedierices);
        } catch (e) {
            console.log(e);
        }
    });
}

async function getProducts(page) {
    return new Promise(async resolve => {
        try {
            const URL = `https://c53d4fa996c9f9018788913d6729a7c1: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@viedierices-lv.myshopify.com/admin/products.json?limit=250&page=${page}`;
            let viedierices = axios.get(URL)
                .then(response => {
                    return response.data
                })
                .catch(err => {
                    return err;
                });

            resolve(viedierices);
        } catch (e) {
            console.log(e);
        }
    });
}

async function getSmartColections() {
    return new Promise(async resolve => {
        try {
            const URL = 'https://c53d4fa996c9f9018788913d6729a7c1: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@viedierices-lv.myshopify.com/admin/api/2020-04/custom_collections.json';
            let colections = axios.get(URL)
                .then(response => {
                    return response.data
                })
                .catch(err => {
                    return err;
                });

            resolve(colections);
        } catch (e) {
            console.log(e);
        }
    });
}

