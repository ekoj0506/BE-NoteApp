export const typeDefs=`#graphql
scalar Date
type Folder{
    name: String,
    id: String,
    createdAt: String,
    author: Author,
    notes: [Note],
    
}
type Author{
    name: String,
    uid: String,
    id: String,
}
type Note{
    id: String,
    folderId: String,
    content: String,
    createAt: Date
}
type Query{
    folders: [Folder],
    folder(folderId: String): Folder,
    note(noteId: String): Note,

}
type Mutation{
    addFolder(name: String!, authorId: ID): Folder,
    addNote(content: String, folderId: String): Note,
    updateNote(content: String, id: String): Note,
    register(uid: String!,name: String! ): Author,
}
`;