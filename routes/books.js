const express = require("express");
const { books } = require("../data/books.json");
const {users} = require("../data/users.json");

const router = express.Router();

/**
 * Route: /book
 * Method: GET
 * Access: public
 * Description: get all book information
 * Parameter:None
 */

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "All books data",
    data: books,
  });
});

/**
 * Route: /book
 * Method: POST
 * Access: public
 * Description: Add new books
 * Parameter:None
 */
router.post("/",(req,res)=>{
  const {id , name ,author ,genre, price, publisher} = req.body;

  const book = books.find((each)=> each.id===id)

  if(book){
     return res.status(404).json({
        success:false,
        message: "Book already exist"
     })
  }

  books.push({
    id,
    name,
    author,
    genre,
    price,
    publisher,
  })

  return res.status(200).json({
       success:true,
       message: " New Book Added Successfully",
       data: books
  })



})

/**
 * Route: /book/:id
 * Method: PUT
 * Access: public
 * Description: Update book by id
 * Parameter:id
 */

router.put("/:id",(req,res)=>{
  const {data} = req.body
  const {id} = req.params

  const book = books.find((each)=>each.id===id)

  if(!book){
    return res.status(404).json({
       status:false,
       message:"Book does not Exist!"

    })
  }
  
  const updatedBookData = books.map((each)=>{
     if(each.id===id){
      return{
        ...each,
        ...data,
      }
     }
     return each
  })

  return res.status(200).json({
    success:true,
    message: "Book Data Updated !!",
    data: updatedBookData,
})
})
/**
 * Route: /book/issued
 * Method: GET
 * Access: public
 * Description: get  book information of book issued
 * Parameter:none
 */

router.get("/issued",(req,res)=>{
  const userWithIssuedBook = users.filter((each)=>{
    if(each.issuedBook) return each;
  })
  const issuedBook = [];
  userWithIssuedBook.forEach((each)=>{
    const book = books.find((book)=>(book.id  === each.issuedBook))
    book.issuedBy = each.name
    book.issuedDate = each.issuedDate
    book.returnDate = each.returnDate

    issuedBook.push(book)
  })
  if(issuedBook.length===0){
     return res.status(404).json({
      success: false,
      message: "No Book Have been Issued"
     })
  }
  return res.status(200).json({
    success:true,
    message:"Users with issued books",
    data:issuedBook
  })
})

/**
 * Route: /book/:id
 * Method: GET
 * Access: public
 * Description: get  book information by id
 * Parameter:id
 */


router.get("/:id",(req,res)=>{
    const {id}= req.params
    const book=books.find((each)=>each.id===id)

    if(!book){
       return res.status(404).json({
        success:false,
        message:"No such Book exist!"
       })
    }
    return res.status(200).json({
        success:true,
        message:"Book found!!",
        data:book
    }) 

})


module.exports = router;
