import mongoose from "mongoose";
const foldelSchema =new mongoose.Schema({

    name:{
        type: String,
        require: true,
    },
    authorId:{
        type: String,
        requireP: true,},
      },  {timestamps: true}

);
const FolderModel =mongoose.model('Folder', foldelSchema);
export default FolderModel;
