//making a apifeature class for using features like search,filter,pagination
class ApiFeatures {
    // query in the url means anything after ? in the url is the query
    //here in constructor query is Product.find() and queryStr is req.query which is anything after ? in the url is the query as obj
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        //if this this.queryStr.keyword is not present return a empty obj else a obj with name
        const keyword = this.queryStr.keyword
            ? {
                name: {
                    //$regex is regular expression in mongodb, it not only searches the exact name but also searches those in which this name is present
                    $regex: this.queryStr.keyword,
                    //'i' means case insensitive i.e. it doesnt matter if it is capital letter or small letter 
                    $options: "i",
                },
            }
            : {};
        //then we are changing the query(product.find()) i.e. putting a filter in find which is destructured keyword which contains name
        this.query = this.query.find({ ...keyword });
        //then returning the whole obj
        return this;
    }
//filter for categories
    filter() {
        //first we will copy the queryStr, we are doing this   { ...this.queryStr } as this.queryStr is an obj & if we dont do this only reference will be assigned
        const queryCopy = { ...this.queryStr };  //here first the this.queryStr values are seperated and then forms a new obj by using {}


        //   Removing some fields for category i.e we are removing these fields(keyword,page,limit) from queryStr(after ? in url)
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete queryCopy[key]);

        // Filter For Price and Rating as we will use range system in them and we need to use operators like gt,gte
        let queryStr = JSON.stringify(queryCopy);   //as we need $ sign in front of mongodb operators like $gt $lt ,we first convert the obj into json
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`) //and then /\b(give wt u want to change)\b/g 


        this.query = this.query.find(JSON.parse(queryStr)); //converting json to js obj
        return this;
    }

    pagination(resultPerPage) {
        //in this.queryStr.page we will get the page parameter if it is not there we will take 1 as default value
        const currentPage = Number(this.queryStr.page) || 1;

        //if we have 50 items and we are in second page and result per page is 10 then we have to skip first 10 items and show them from 11
        const skip = resultPerPage * (currentPage - 1); //if u are in page 1 ,skip ll be 0 i.e u will not skip anything

        //we use limit fn which defines how many items we can display and then we use skip fn which skips x no. of items and starts displaying after xth item
        this.query = this.query.limit(resultPerPage).skip(skip); 

        //we return the whole apiFeature obj
        return this;
    }
}

//we export this class to controller.js 
module.exports = ApiFeatures;
