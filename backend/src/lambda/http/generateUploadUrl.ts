import 'source-map-support/register'
import { createLogger } from "../../utils/logger";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
//import { getUserId } from '../utils'
import { createAttachmentPresignedUrl } from '../../businessLogic/todos'

const logger = createLogger('generateUploadUrl')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing Event ', event)
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const URL = await createAttachmentPresignedUrl(todoId)
    
    logger.info("todo Attachment URL CREATED", {
      // Additional information stored with a log statement
      key: todoId, 
      date: new Date().toISOString,
    });
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          uploadUrl: URL
        }
      )
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
