import express from "express";
import bodyParser from "body-parser";
import path from "path"
import axios from "axios";
import {v4 as uuid } from "uuid";
import methodOverride from "method-override"

import { dirname } from "path";
import { fileURLToPath } from "url";


const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()

const listArray = []

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('__method'))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
    res.render('home')
})
app.get('/todoList', (req,res)=> {

    res.render('todo', {listArray})
    console.log(listArray)
})
app.post('/todoList', (req, res) => {
    const { newTodo} = req.body
    listArray.push({id: uuid(), newTodo})
    if(!newTodo){
        res.render('404err')
    }
    res.redirect("/todoList")

})

//blog---------------------
const blogs = []
app.get('/myBlog', (req,res) => {
    res.render('myBlog', {blogs})
})

//post
app.post('/myBlog', (req,res) => {
    const {username, blogPost, image} = req.body
    blogs.push({username, blogPost, image, id:uuid(), comments:[]}) //{commentUserId: '', username:'', comment: ''}
    console.log(blogs.username)
    if(!blogPost){
        res.render('404err')
    }
    res.redirect('/myBlog')
})
//edit---
app.get('/myBlog/:id/edit', (req, res) =>{
    const {id} = req.params
    const blog = blogs.find(b => b.id === id)
    res.render('edit', {blog})
})
//update..patch the edited comment
app.patch('/myBlog/:id', (req, res) => {
    const {id} = req.params
    const newBlog = req.body.blogPost
    const findBlog = blogs.find(b => b.id === id)
    findBlog.blogPost = newBlog;
    res.redirect('/myBlog')
})

//make a comment
app.patch('/myBlog/:id/comments', (req, res) => {
    const {id} = req.params
    const newComment= req.body.commentsComment
    const commentByUser = req.body.commentsUsername
    const findBlog = blogs.find( b => b.id === id )
    if(!findBlog){
            res.render('404err')
    }
    findBlog.comments.push({commentUserId: uuid(), username: commentByUser, comment: newComment})
    
    res.redirect('/myBlog')
})

//delete a comment
app.delete('/myBlog/:id/comments/:commentUserId', (req, res) =>{
    const {id, commentUserId} = req.params

    const blog = blogs.find( b => b.id === id)
    console.log(blog)
    
    if(blog){
        const index = blog.comments.findIndex( c => c.commentUserId === commentUserId)
        if(index === -1){
            res.render('404err')
        }
        blog.comments.splice(index, 1)
        res.redirect('/myBlog')
        
    }

   
})

//delete post
app.delete('/myBlog/:id', (req, res) =>{
    const {id} = req.params
    const index = blogs.findIndex(b => b.id === id)

    if(index === -1){
        res.render('404err')
    }
    blogs.splice(index, 1)
    res.redirect('/myBlog')
})

app.listen(3000, ()=> {
    console.log('hello blog app')
})