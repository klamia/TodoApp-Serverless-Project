import { TodosAcess } from '../dataLayer/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate';



// TODO: Implement businessLogic

const todosAcess = new TodosAcess()
const bucketName = process.env.ATTACHMENT_S3_BUCKET


export async function getAllTodosPerUser(userId:string): Promise<TodoItem[]> {
    return await todosAcess.getAllTodosPerUser(userId);
}

export async function createTodo(
    createTodoRequest: CreateTodoRequest, userId:string): Promise<TodoItem> 
    {
  
    const todoId = uuid.v4() 
    return await todosAcess.createTodo({
      userId: userId,
      todoId: todoId,
      createdAt: new Date().getTime().toString(),
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate,
      done: false,
      attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
    })
  }

  
export async function updateTodo (
    updateTodoRequest: UpdateTodoRequest,
    todoId: string,
    userId:string
  ): Promise<TodoUpdate> {
    
    return await todosAcess.updateTodo(updateTodoRequest, todoId, userId)
  }  
  
export function deleteTodo (todoId: string, userId: string): Promise<string> {
    
    return todosAcess.deleteTodo(todoId, userId)
  }


export function createAttachmentPresignedUrl (todoId: string): Promise<string> {
    return todosAcess.createAttachmentPresignedUrl(todoId)
  }