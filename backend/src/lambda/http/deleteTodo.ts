import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils'
import { deleteTodo } from '../../businessLogic/todos'
import { createLogger } from "../../utils/logger"

const logger = createLogger("deletetodo");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    const userId = getUserId(event)
    const deleteData = await deleteTodo(todoId, userId)

    logger.info("todo DELETED", {
      
      key: todoId,
      userId: userId,
      date: new Date().toISOString,
    });

    return {
      statusCode: 200,
      body: deleteData
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
