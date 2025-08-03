import { getClient } from '../client';
import { type DifyConfig } from '../config';
import { 
  DatasetObject, 
  CreateDatasetRequest, 
  DatasetObjectSchema 
} from '../types';
import { DatasetError } from '../error';

/**
 * 创建数据集
 * @param options 创建数据集的选项
 * @param config 可选配置对象
 * @returns 创建的数据集对象
 * @throws {DatasetError} 当API调用失败时抛出错误
 */
export async function createDataset(
  options: CreateDatasetRequest,
  config?: Partial<DifyConfig>
): Promise<DatasetObject> {
  try {
    const client = getClient(config);
    const response = await client.post('/datasets', options);
    
    // 验证响应数据
    const validatedData = DatasetObjectSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new DatasetError(error);
  }
}

/**
 * 获取数据集列表
 * @param config 可选配置对象
 * @returns 数据集对象数组
 * @throws {DatasetError} 当API调用失败时抛出错误
 */
export async function getDatasets(
  config?: Partial<DifyConfig>
): Promise<DatasetObject[]> {
  try {
    const client = getClient(config);
    const response = await client.get('/datasets');
    
    // 验证响应数据
    const validatedData = response.data.map((item: any) => 
      DatasetObjectSchema.parse(item)
    );
    return validatedData;
  } catch (error: any) {
    throw new DatasetError(error);
  }
}

/**
 * 获取指定数据集的详细信息
 * @param datasetId 数据集ID
 * @param config 可选配置对象
 * @returns 数据集对象
 * @throws {DatasetError} 当API调用失败时抛出错误
 */
export async function getDataset(
  datasetId: string,
  config?: Partial<DifyConfig>
): Promise<DatasetObject> {
  try {
    const client = getClient(config);
    const response = await client.get(`/datasets/${datasetId}`);
    
    // 验证响应数据
    const validatedData = DatasetObjectSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new DatasetError(error);
  }
}

/**
 * 更新数据集
 * @param datasetId 数据集ID
 * @param options 更新选项
 * @param config 可选配置对象
 * @returns 更新后的数据集对象
 * @throws {DatasetError} 当API调用失败时抛出错误
 */
export async function updateDataset(
  datasetId: string,
  options: Partial<CreateDatasetRequest>,
  config?: Partial<DifyConfig>
): Promise<DatasetObject> {
  try {
    const client = getClient(config);
    const response = await client.patch(`/datasets/${datasetId}`, options);
    
    // 验证响应数据
    const validatedData = DatasetObjectSchema.parse(response.data);
    return validatedData;
  } catch (error: any) {
    throw new DatasetError(error);
  }
}

/**
 * 删除数据集
 * @param datasetId 数据集ID
 * @param config 可选配置对象
 * @returns 删除操作的结果
 * @throws {DatasetError} 当API调用失败时抛出错误
 */
export async function deleteDataset(
  datasetId: string,
  config?: Partial<DifyConfig>
): Promise<{ success: boolean; message: string }> {
  try {
    const client = getClient(config);
    const response = await client.delete(`/datasets/${datasetId}`);
    
    return {
      success: true,
      message: response.data.message || '数据集删除成功'
    };
  } catch (error: any) {
    throw new DatasetError(error);
  }
}