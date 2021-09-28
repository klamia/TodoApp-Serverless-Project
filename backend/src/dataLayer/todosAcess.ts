import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
//import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { AttachmentUtils } from './attachmentUtils';

const XAWS = AWSXRay.captureAWS(AWS)

//const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAcess {

    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly todosTable = process.env.TODOS_TABLE) {
    }
  
    async getAllTodosPerUser(userId: string): Promise<TodoItem[]> {
      console.log('Getting all todos')
  
      const result = await this.docClient.query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
          },
          ScanIndexForward: false
      }).promise()
  
      const items = result.Items
      return items as TodoItem[]
    }
  
    async createTodo(todo: TodoItem): Promise<TodoItem> {
      console.log('Creating new todo')
      await this.docClient.put({
        TableName: this.todosTable,
        Item: todo
      }).promise()
  
      return todo as TodoItem
    }

    async updateTodo (todoUpdate: TodoUpdate,todoId: string,userId: string): Promise<TodoUpdate> {
      console.log('Updating todo')
      const result = await this.docClient.update({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        },
        UpdateExpression: 'set #a = :a, #b = :b, #c = :c',
        ExpressionAttributeNames: {
          '#a': 'name',
          '#b': 'dueDate',
          '#c': 'done'
        },
        ExpressionAttributeValues: {
          ':a': todoUpdate['name'],
          ':b': todoUpdate['dueDate'],
          ':c': todoUpdate['done']
        },
        ReturnValues: 'ALL_NEW'
      }).promise()

      console.log(result)
      const attributes = result.Attributes
  
      return attributes as TodoUpdate
    }
    
    async deleteTodo (todoId: string, userId: string): Promise<string> {
      console.log('Deleting todo')
  
      const result = await this.docClient.delete({
        TableName: this.todosTable,
        Key: {
          userId: userId,
          todoId: todoId
        }
      }).promise()

      console.log(result)
  
      return '' as string
    }
  
    async createAttachmentPresignedUrl (todoId: string): Promise<string> {
      console.log('Generating URL')
      const url = AttachmentUtils(todoId)
      console.log(url)

      return url as string
    }
   
  
  
  }

  
  
  
  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }