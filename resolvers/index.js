import mongoose from "mongoose";
import fakeData from "../fakeData/index.js";
import AuthorModel from "../models/AuthorModel.js";
import FolderModel from "../models/FolderModel.js";
import NoteModel from "../models/NoteModel.js";
import { log } from "console";
export const resolvers={
    Query:
    {
     folders: async(parent, args, context)=>{
        // return fakeData.folder
         const folders= await FolderModel.find({authorId:context.uid}).sort({updateAt: 'desc'});
         
         return folders;
    },
     folder:  async(parent, args)=>{
   
        const folderId=args.folderId;
        const folder= await FolderModel.findOne({_id: folderId});       
        return folder;
    },
    note: async (parent, args)=>{
  
        const noteId=args.noteId;
        
        const data=await NoteModel.findOne({_id: noteId});
   
        return data;
    },
   },
   Mutation:{
     addFolder: async (parent, args, context)=>{
      
        const newFolder= new FolderModel({...args,authorId: context.uid});
        await newFolder.save();
        return newFolder;
     },
     register: async(parent, args)=>
     {  
        console.log('fouuuuuuuuuuuuuuu');
        const foundUser=await AuthorModel.findOne({uid: args.uid});
    
        if (!foundUser){
        const newUser=new AuthorModel(args);
        await newUser.save();
        
        return newuser;
        }
        return foundUser;
     },
     addNote: async(parent, args)=>{
        const newNote= new NoteModel({...args,});
        await newNote.save();
        return newNote;


     },
     updateNote: async(parent, args)=>{
        const id=args.id;
        console.log(id);
        const note=await NoteModel.findByIdAndUpdate(id, args);
       return note;
     },
   },

    
    Folder:
    {
        author: async (parent, args) =>{
        
            const authorId=parent.authorId;
            const author=await AuthorModel.findOne({uid: authorId});
            return author;
        },
        notes: async (parent, args) =>{
           const notes=await NoteModel.find({folderId: parent.id})
         
            return notes;
        },
    }
};