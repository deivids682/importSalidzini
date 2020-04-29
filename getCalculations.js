const axios = require('axios');

module.exports.getXml = async function () {
    return new Promise(async resolve => {
        try {

            let viedierices = getProducts();
            let smartColections = getSmartColections();
            let colectionsById = getSmartColectionById();

            let product = await Promise.all([viedierices, smartColections, colectionsById]);
            let xml = {};

            let cats = product[1]['custom_collections'];
            let cats2 = product[2]['collects'];

            product[0].products.forEach(item => {

                const [cat1, color] = item.product_type.split("-");

                xml[item.id] = {};
                xml[item.id]['title'] = item.title;
                xml[item.id]['vendor'] = item.vendor;
                xml[item.id]['cat'] = cats.find(element => element.title === item.tags).handle;
                xml[item.id]['fullCat'] = `${cat1} &gt;&gt; ${item.tags}`;
                xml[item.id]['tags'] = item.tags;
                xml[item.id]['productLink'] = `https://viedierices.lv/collections/${xml[item.id].cat}/products/${item.handle}`
                xml[item.id]['catLink'] = `https://viedierices.lv/collections/${xml[item.id].cat}`
                xml[item.id]['imgSrc'] = item.images[0].src;
                xml[item.id]['price'] = item.variants[0].price;
                xml[item.id]['model'] = item.variants[0].barcode;
                xml[item.id]['color'] = color || "nav";
            });
            //xml = product[0].products;
            let xmlStr = "";
            for (const id in xml) {
                const p = xml[id];
                xmlStr += `<item>
                            <name>${p.title}</name>
                            <link>${p.productLink}</link>
                            <price>${p.price}</price>
                            <image>${p.imgSrc}</image>
                            <category_full>${p.fullCat}</category_full>
                            <category_link>${p.catLink}</category_link>
                            <brand>${p.vendor}</brand>
                            <model>${p.model}</model> 
                            <color>${p.color}</color> 
                            <delivery_omniva>2.5</delivery_omniva>
                            <delivery_days_riga>5</delivery_days_riga>
                            <delivery_days_latvija>5</delivery_days_latvija>
                            <adult>no</adult>
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

async function getProducts() {
    return new Promise(async resolve => {
        try {
            const URL = 'https://c53d4fa996c9f9018788913d6729a7c1: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@viedierices-lv.myshopify.com/admin/api/2020-04/products.json';
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

async function getSmartColectionById() {
    return new Promise(async resolve => {
        try {
            const URL = 'https://c53d4fa996c9f9018788913d6729a7c1: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@viedierices-lv.myshopify.com/admin/api/2020-04/collects.json';
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


