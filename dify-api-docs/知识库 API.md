# 知识库 API

### 鉴权

Service API 使用 `API-Key` 进行鉴权。

建议开发者把 `API-Key` 放在后端存储，而非分享或者放在客户端存储，以免 `API-Key` 泄露，导致财产损失。

所有 API 请求都应在 **`Authorization`** HTTP Header 中包含您的 `API-Key`，如下所示：

### Code

```javascript
  Authorization: Bearer {API_KEY}
```

CopyCopied!

------



POST/datasets/{dataset_id}/document/create-by-text

## [通过文本创建文档](https://cloud.dify.ai/datasets?category=api#create-by-text)

此接口基于已存在知识库，在此知识库的基础上通过文本创建新的文档

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

### Request Body

- - Name

    `name`

  - Type

    string

  - Description

    文档名称

- - Name

    `text`

  - Type

    string

  - Description

    文档内容

- - Name

    `indexing_technique`

  - Type

    string

  - Description

    索引方式`high_quality` 高质量：使用 Embedding 模型进行嵌入，构建为向量数据库索引`economy` 经济：使用 keyword table index 的倒排索引进行构建

- - Name

    `doc_form`

  - Type

    string

  - Description

    索引内容的形式`text_model` text 文档直接 embedding，经济模式默认为该模式`hierarchical_model` parent-child 模式`qa_model` Q&A 模式：为分片文档生成 Q&A 对，然后对问题进行 embedding

- - Name

    `doc_language`

  - Type

    string

  - Description

    在 Q&A 模式下，指定文档的语言，例如：`English`、`Chinese`

- - Name

    `process_rule`

  - Type

    object

  - Description

    处理规则`mode` (string) 清洗、分段模式 ，automatic 自动 / custom 自定义 / hierarchical 父子`rules` (object) 自定义规则（自动模式下，该字段为空）`pre_processing_rules` (array[object]) 预处理规则`id` (string) 预处理规则的唯一标识符枚举：`remove_extra_spaces` 替换连续空格、换行符、制表符`remove_urls_emails` 删除 URL、电子邮件地址`enabled` (bool) 是否选中该规则，不传入文档 ID 时代表默认值`segmentation` (object) 分段规则`separator` 自定义分段标识符，目前仅允许设置一个分隔符。默认为 `\n``max_tokens` 最大长度（token）默认为 1000`parent_mode` 父分段的召回模式 `full-doc` 全文召回 / `paragraph` 段落召回`subchunk_segmentation` (object) 子分段规则`separator` 分段标识符，目前仅允许设置一个分隔符。默认为 `***``max_tokens` 最大长度 (token) 需要校验小于父级的长度`chunk_overlap` 分段重叠指的是在对数据进行分段时，段与段之间存在一定的重叠部分（选填）

- 当知识库未设置任何参数的时候，首次上传需要提供以下参数，未提供则使用默认选项：

- - Name

    `retrieval_model`

  - Type

    object

  - Description

    检索模式`search_method` (string) 检索方法`hybrid_search` 混合检索`semantic_search` 语义检索`full_text_search` 全文检索`reranking_enable` (bool) 是否开启rerank`reranking_mode` (String) 混合检索`weighted_score` 权重设置`reranking_model` Rerank 模型`reranking_model` (object) Rerank 模型配置`reranking_provider_name` (string) Rerank 模型的提供商`reranking_model_name` (string) Rerank 模型的名称`top_k` (int) 召回条数`score_threshold_enabled` (bool)是否开启召回分数限制`score_threshold` (float) 召回分数限制

- - Name

    `embedding_model`

  - Type

    string

  - Description

    Embedding 模型名称

- - Name

    `embedding_model_provider`

  - Type

    string

  - Description

    Embedding 模型供应商

### Request

POST

/datasets/{dataset_id}/document/create-by-text

```
curl --location --request POST 'https://api.dify.ai/v1/datasets/{dataset_id}/document/create-by-text' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{"name": "text","text": "text","indexing_technique": "high_quality","process_rule": {"mode": "automatic"}}'
```

CopyCopied!

### Response

```json
{
  "document": {
    "id": "",
    "position": 1,
    "data_source_type": "upload_file",
    "data_source_info": {
        "upload_file_id": ""
    },
    "dataset_process_rule_id": "",
    "name": "text.txt",
    "created_from": "api",
    "created_by": "",
    "created_at": 1695690280,
    "tokens": 0,
    "indexing_status": "waiting",
    "error": null,
    "enabled": true,
    "disabled_at": null,
    "disabled_by": null,
    "archived": false,
    "display_status": "queuing",
    "word_count": 0,
    "hit_count": 0,
    "doc_form": "text_model"
  },
  "batch": ""
}
```

CopyCopied!

------



POST/datasets/{dataset_id}/document/create-by-file

## [通过文件创建文档](https://cloud.dify.ai/datasets?category=api#create-by-file)

此接口基于已存在知识库，在此知识库的基础上通过文件创建新的文档

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

### Request Body

- - Name

    `data`

  - Type

    multipart/form-data json string

  - Description

    `original_document_id` 源文档 ID（选填）用于重新上传文档或修改文档清洗、分段配置，缺失的信息从源文档复制源文档不可为归档的文档当传入 `original_document_id` 时，代表文档进行更新操作，`process_rule` 为可填项目，不填默认使用源文档的分段方式未传入 `original_document_id` 时，代表文档进行新增操作，`process_rule` 为必填`indexing_technique` 索引方式`high_quality` 高质量：使用 embedding 模型进行嵌入，构建为向量数据库索引`economy` 经济：使用 keyword table index 的倒排索引进行构建`doc_form` 索引内容的形式`text_model` text 文档直接 embedding，经济模式默认为该模式`hierarchical_model` parent-child 模式`qa_model` Q&A 模式：为分片文档生成 Q&A 对，然后对问题进行 embedding`doc_language` 在 Q&A 模式下，指定文档的语言，例如：`English`、`Chinese``process_rule` 处理规则`mode` (string) 清洗、分段模式，automatic 自动 / custom 自定义 / hierarchical 父子`rules` (object) 自定义规则（自动模式下，该字段为空）`pre_processing_rules` (array[object]) 预处理规则`id` (string) 预处理规则的唯一标识符枚举：`remove_extra_spaces` 替换连续空格、换行符、制表符`remove_urls_emails` 删除 URL、电子邮件地址`enabled` (bool) 是否选中该规则，不传入文档 ID 时代表默认值`segmentation` (object) 分段规则`separator` 自定义分段标识符，目前仅允许设置一个分隔符。默认为 \n`max_tokens` 最大长度（token）默认为 1000`parent_mode` 父分段的召回模式 `full-doc` 全文召回 / `paragraph` 段落召回`subchunk_segmentation` (object) 子分段规则`separator` 分段标识符，目前仅允许设置一个分隔符。默认为 `***``max_tokens` 最大长度 (token) 需要校验小于父级的长度`chunk_overlap` 分段重叠指的是在对数据进行分段时，段与段之间存在一定的重叠部分（选填）

- - Name

    `file`

  - Type

    multipart/form-data

  - Description

    需要上传的文件。

- 当知识库未设置任何参数的时候，首次上传需要提供以下参数，未提供则使用默认选项：

- - Name

    `retrieval_model`

  - Type

    object

  - Description

    检索模式`search_method` (string) 检索方法`hybrid_search` 混合检索`semantic_search` 语义检索`full_text_search` 全文检索`reranking_enable` (bool) 是否开启 rerank`reranking_model` (object) Rerank 模型配置`reranking_provider_name` (string) Rerank 模型的提供商`reranking_model_name` (string) Rerank 模型的名称`top_k` (int) 召回条数`score_threshold_enabled` (bool) 是否开启召回分数限制`score_threshold` (float) 召回分数限制

- - Name

    `embedding_model`

  - Type

    string

  - Description

    Embedding 模型名称

- - Name

    `embedding_model_provider`

  - Type

    string

  - Description

    Embedding 模型供应商

### Request

POST

/datasets/{dataset_id}/document/create-by-file

```
curl --location --request POST 'https://api.dify.ai/v1/datasets/{dataset_id}/document/create-by-file' \
--header 'Authorization: Bearer {api_key}' \
--form 'data="{"indexing_technique":"high_quality","process_rule":{"rules":{"pre_processing_rules":[{"id":"remove_extra_spaces","enabled":true},{"id":"remove_urls_emails","enabled":true}],"segmentation":{"separator":"###","max_tokens":500}},"mode":"custom"}}";type=text/plain' \
--form 'file=@"/path/to/file"'
```

CopyCopied!

### Response

```json
{
  "document": {
    "id": "",
    "position": 1,
    "data_source_type": "upload_file",
    "data_source_info": {
      "upload_file_id": ""
    },
    "dataset_process_rule_id": "",
    "name": "Dify.txt",
    "created_from": "api",
    "created_by": "",
    "created_at": 1695308667,
    "tokens": 0,
    "indexing_status": "waiting",
    "error": null,
    "enabled": true,
    "disabled_at": null,
    "disabled_by": null,
    "archived": false,
    "display_status": "queuing",
    "word_count": 0,
    "hit_count": 0,
    "doc_form": "text_model"
  },
  "batch": ""
}
```

CopyCopied!

------



POST/datasets

## [创建空知识库](https://cloud.dify.ai/datasets?category=api#create_empty_dataset)

### Request Body

- - Name

    `name`

  - Type

    string

  - Description

    知识库名称（必填）

- - Name

    `description`

  - Type

    string

  - Description

    知识库描述（选填）

- - Name

    `indexing_technique`

  - Type

    string

  - Description

    索引模式（选填，建议填写）`high_quality` 高质量`economy` 经济

- - Name

    `permission`

  - Type

    string

  - Description

    权限（选填，默认 only_me）`only_me` 仅自己`all_team_members` 所有团队成员`partial_members` 部分团队成员

- - Name

    `provider`

  - Type

    string

  - Description

    Provider（选填，默认 vendor）`vendor` 上传文件`external` 外部知识库

- - Name

    `external_knowledge_api_id`

  - Type

    str

  - Description

    外部知识库 API_ID（选填）

- - Name

    `external_knowledge_id`

  - Type

    str

  - Description

    外部知识库 ID（选填）

- - Name

    `embedding_model`

  - Type

    str

  - Description

    Embedding 模型名称

- - Name

    `embedding_model_provider`

  - Type

    str

  - Description

    Embedding 模型供应商

- - Name

    `retrieval_model`

  - Type

    object

  - Description

    检索模式`search_method` (string) 检索方法`hybrid_search` 混合检索`semantic_search` 语义检索`full_text_search` 全文检索`reranking_enable` (bool) 是否开启 rerank`reranking_model` (object) Rerank 模型配置`reranking_provider_name` (string) Rerank 模型的提供商`reranking_model_name` (string) Rerank 模型的名称`top_k` (int) 召回条数`score_threshold_enabled` (bool) 是否开启召回分数限制`score_threshold` (float) 召回分数限制

### Request

POST

/datasets

```
curl --location --request POST 'https://api.dify.ai/v1/datasets' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{"name": "name", "permission": "only_me"}'
```

CopyCopied!

### Response

```json
{
  "id": "",
  "name": "name",
  "description": null,
  "provider": "vendor",
  "permission": "only_me",
  "data_source_type": null,
  "indexing_technique": null,
  "app_count": 0,
  "document_count": 0,
  "word_count": 0,
  "created_by": "",
  "created_at": 1695636173,
  "updated_by": "",
  "updated_at": 1695636173,
  "embedding_model": null,
  "embedding_model_provider": null,
  "embedding_available": null
}
```

CopyCopied!

------



GET/datasets

## [知识库列表](https://cloud.dify.ai/datasets?category=api#dataset_list)

### Query

- - Name

    `keyword`

  - Type

    string

  - Description

    搜索关键词，可选

- - Name

    `tag_ids`

  - Type

    array[string]

  - Description

    标签 ID 列表，可选

- - Name

    `page`

  - Type

    integer

  - Description

    页码，可选，默认为 1

- - Name

    `limit`

  - Type

    string

  - Description

    返回条数，可选，默认 20，范围 1-100

- - Name

    `include_all`

  - Type

    boolean

  - Description

    是否包含所有数据集（仅对所有者生效），可选，默认为 false

### Request

GET

/datasets

```
curl --location --request GET 'https://api.dify.ai/v1/datasets?page=1&limit=20' \
--header 'Authorization: Bearer {api_key}'
```

CopyCopied!

### Response

```json
{
  "data": [
    {
      "id": "",
      "name": "知识库名称",
      "description": "描述信息",
      "permission": "only_me",
      "data_source_type": "upload_file",
      "indexing_technique": "",
      "app_count": 2,
      "document_count": 10,
      "word_count": 1200,
      "created_by": "",
      "created_at": "",
      "updated_by": "",
      "updated_at": ""
    },
    ...
  ],
  "has_more": true,
  "limit": 20,
  "total": 50,
  "page": 1
}
```

CopyCopied!

------



GET/datasets/{dataset_id}

## [查看知识库详情](https://cloud.dify.ai/datasets?category=api#view_dataset)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

### Request

GET

/datasets/{dataset_id}

```
curl --location --request GET 'https://api.dify.ai/v1/datasets/{dataset_id}' \
--header 'Authorization: Bearer {api_key}'
```

CopyCopied!

### Response

```json
{
  "id": "eaedb485-95ac-4ffd-ab1e-18da6d676a2f",
  "name": "Test Knowledge Base",
  "description": "",
  "provider": "vendor",
  "permission": "only_me",
  "data_source_type": null,
  "indexing_technique": null,
  "app_count": 0,
  "document_count": 0,
  "word_count": 0,
  "created_by": "e99a1635-f725-4951-a99a-1daaaa76cfc6",
  "created_at": 1735620612,
  "updated_by": "e99a1635-f725-4951-a99a-1daaaa76cfc6",
  "updated_at": 1735620612,
  "embedding_model": null,
  "embedding_model_provider": null,
  "embedding_available": true,
  "retrieval_model_dict": {
    "search_method": "semantic_search",
    "reranking_enable": false,
    "reranking_mode": null,
    "reranking_model": {
      "reranking_provider_name": "",
      "reranking_model_name": ""
    },
    "weights": null,
    "top_k": 2,
    "score_threshold_enabled": false,
    "score_threshold": null
  },
  "tags": [],
  "doc_form": null,
  "external_knowledge_info": {
    "external_knowledge_id": null,
    "external_knowledge_api_id": null,
    "external_knowledge_api_name": null,
    "external_knowledge_api_endpoint": null
  },
  "external_retrieval_model": {
    "top_k": 2,
    "score_threshold": 0.0,
    "score_threshold_enabled": null
  }
}
```

CopyCopied!

------



PATCH/datasets/{dataset_id}

## [修改知识库详情](https://cloud.dify.ai/datasets?category=api#update_dataset)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

### Request Body

- - Name

    `indexing_technique`

  - Type

    string

  - Description

    索引模式（选填，建议填写）`high_quality` 高质量`economy` 经济

- - Name

    `permission`

  - Type

    string

  - Description

    权限（选填，默认 only_me）`only_me` 仅自己`all_team_members` 所有团队成员`partial_members` 部分团队成员

- - Name

    `embedding_model_provider`

  - Type

    string

  - Description

    嵌入模型提供商（选填）, 必须先在系统内设定好接入的模型，对应的是provider字段

- - Name

    `embedding_model`

  - Type

    string

  - Description

    嵌入模型（选填）

- - Name

    `retrieval_model`

  - Type

    object

  - Description

    检索参数（选填，如不填，按照默认方式召回）`search_method` (text) 检索方法：以下四个关键字之一，必填`keyword_search` 关键字检索`semantic_search` 语义检索`full_text_search` 全文检索`hybrid_search` 混合检索`reranking_enable` (bool) 是否启用 Reranking，非必填，如果检索模式为 semantic_search 模式或者 hybrid_search 则传值`reranking_mode` (object) Rerank 模型配置，非必填，如果启用了 reranking 则传值`reranking_provider_name` (string) Rerank 模型提供商`reranking_model_name` (string) Rerank 模型名称`weights` (float) 混合检索模式下语意检索的权重设置`top_k` (integer) 返回结果数量，非必填`score_threshold_enabled` (bool) 是否开启 score 阈值`score_threshold` (float) Score 阈值

- - Name

    `partial_member_list`

  - Type

    array

  - Description

    部分团队成员 ID 列表（选填）

### Request

PATCH

/datasets/{dataset_id}

```
curl --location --request PATCH 'https://api.dify.ai/v1/datasets/{dataset_id}' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{
      "name": "Test Knowledge Base", 
      "indexing_technique": "high_quality", 
      "permission": "only_me", 
      "embedding_model_provider": "zhipuai", 
      "embedding_model": "embedding-3", 
      "retrieval_model": {
        "search_method": "keyword_search",
        "reranking_enable": false,
        "reranking_mode": null,
        "reranking_model": {
            "reranking_provider_name": "",
            "reranking_model_name": ""
        },
        "weights": null,
        "top_k": 1,
        "score_threshold_enabled": false,
        "score_threshold": null
      }, 
      "partial_member_list": []
    }'
  
```

CopyCopied!

### Response

```json
{
  "id": "eaedb485-95ac-4ffd-ab1e-18da6d676a2f",
  "name": "Test Knowledge Base",
  "description": "",
  "provider": "vendor",
  "permission": "only_me",
  "data_source_type": null,
  "indexing_technique": "high_quality",
  "app_count": 0,
  "document_count": 0,
  "word_count": 0,
  "created_by": "e99a1635-f725-4951-a99a-1daaaa76cfc6",
  "created_at": 1735620612,
  "updated_by": "e99a1635-f725-4951-a99a-1daaaa76cfc6",
  "updated_at": 1735622679,
  "embedding_model": "embedding-3",
  "embedding_model_provider": "zhipuai",
  "embedding_available": null,
  "retrieval_model_dict": {
      "search_method": "semantic_search",
      "reranking_enable": false,
      "reranking_mode": null,
      "reranking_model": {
          "reranking_provider_name": "",
          "reranking_model_name": ""
      },
      "weights": null,
      "top_k": 2,
      "score_threshold_enabled": false,
      "score_threshold": null
  },
  "tags": [],
  "doc_form": null,
  "external_knowledge_info": {
      "external_knowledge_id": null,
      "external_knowledge_api_id": null,
      "external_knowledge_api_name": null,
      "external_knowledge_api_endpoint": null
  },
  "external_retrieval_model": {
      "top_k": 2,
      "score_threshold": 0.0,
      "score_threshold_enabled": null
  },
  "partial_member_list": []
}
```

CopyCopied!

------



DELETE/datasets/{dataset_id}

## [删除知识库](https://cloud.dify.ai/datasets?category=api#delete_dataset)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

### Request

DELETE

/datasets/{dataset_id}

```
curl --location --request DELETE 'https://api.dify.ai/v1/datasets/{dataset_id}' \
--header 'Authorization: Bearer {api_key}'
```

CopyCopied!

### Response

```text
204 No Content
```

CopyCopied!

------



POST/datasets/{dataset_id}/documents/{document_id}/update-by-text

## [通过文本更新文档](https://cloud.dify.ai/datasets?category=api#update-by-text)

此接口基于已存在知识库，在此知识库的基础上通过文本更新文档

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

- - Name

    `document_id`

  - Type

    string

  - Description

    文档 ID

### Request Body

- - Name

    `name`

  - Type

    string

  - Description

    文档名称（选填）

- - Name

    `text`

  - Type

    string

  - Description

    文档内容（选填）

- - Name

    `process_rule`

  - Type

    object

  - Description

    处理规则（选填）`mode` (string) 清洗、分段模式 ，automatic 自动 / custom 自定义 / hierarchical 父子`rules` (object) 自定义规则（自动模式下，该字段为空）`pre_processing_rules` (array[object]) 预处理规则`id` (string) 预处理规则的唯一标识符枚举：`remove_extra_spaces` 替换连续空格、换行符、制表符`remove_urls_emails` 删除 URL、电子邮件地址`enabled` (bool) 是否选中该规则，不传入文档 ID 时代表默认值`segmentation` (object) 分段规则`separator` 自定义分段标识符，目前仅允许设置一个分隔符。默认为 \n`max_tokens` 最大长度（token）默认为 1000`parent_mode` 父分段的召回模式 `full-doc` 全文召回 / `paragraph` 段落召回`subchunk_segmentation` (object) 子分段规则`separator` 分段标识符，目前仅允许设置一个分隔符。默认为 `***``max_tokens` 最大长度 (token) 需要校验小于父级的长度`chunk_overlap` 分段重叠指的是在对数据进行分段时，段与段之间存在一定的重叠部分（选填）

### Request

POST

/datasets/{dataset_id}/documents/{document_id}/update-by-text

```
curl --location --request POST 'https://api.dify.ai/v1/datasets/{dataset_id}/documents/{document_id}/update-by-text' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{"name": "name","text": "text"}'
```

CopyCopied!

### Response

```json
{
  "document": {
    "id": "",
    "position": 1,
    "data_source_type": "upload_file",
    "data_source_info": {
      "upload_file_id": ""
    },
    "dataset_process_rule_id": "",
    "name": "name.txt",
    "created_from": "api",
    "created_by": "",
    "created_at": 1695308667,
    "tokens": 0,
    "indexing_status": "waiting",
    "error": null,
    "enabled": true,
    "disabled_at": null,
    "disabled_by": null,
    "archived": false,
    "display_status": "queuing",
    "word_count": 0,
    "hit_count": 0,
    "doc_form": "text_model"
  },
  "batch": ""
}
```

CopyCopied!

------



POST/datasets/{dataset_id}/documents/{document_id}/update-by-file

## [通过文件更新文档](https://cloud.dify.ai/datasets?category=api#update-by-file)

此接口基于已存在知识库，在此知识库的基础上通过文件更新文档的操作。

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

- - Name

    `document_id`

  - Type

    string

  - Description

    文档 ID

### Request Body

- - Name

    `name`

  - Type

    string

  - Description

    文档名称（选填）

- - Name

    `file`

  - Type

    multipart/form-data

  - Description

    需要上传的文件

- - Name

    `process_rule`

  - Type

    object

  - Description

    处理规则（选填）`mode` (string) 清洗、分段模式 ，automatic 自动 / custom 自定义 / hierarchical 父子`rules` (object) 自定义规则（自动模式下，该字段为空）`pre_processing_rules` (array[object]) 预处理规则`id` (string) 预处理规则的唯一标识符枚举：`remove_extra_spaces` 替换连续空格、换行符、制表符`remove_urls_emails` 删除 URL、电子邮件地址`enabled` (bool) 是否选中该规则，不传入文档 ID 时代表默认值`segmentation` (object) 分段规则`separator` 自定义分段标识符，目前仅允许设置一个分隔符。默认为 \n`max_tokens` 最大长度（token）默认为 1000`parent_mode` 父分段的召回模式 `full-doc` 全文召回 / `paragraph` 段落召回`subchunk_segmentation` (object) 子分段规则`separator` 分段标识符，目前仅允许设置一个分隔符。默认为 `***``max_tokens` 最大长度 (token) 需要校验小于父级的长度`chunk_overlap` 分段重叠指的是在对数据进行分段时，段与段之间存在一定的重叠部分（选填）

### Request

POST

/datasets/{dataset_id}/documents/{document_id}/update-by-file

```
curl --location --request POST 'https://api.dify.ai/v1/datasets/{dataset_id}/documents/{document_id}/update-by-file' \
--header 'Authorization: Bearer {api_key}' \
--form 'data="{"name":"Dify","indexing_technique":"high_quality","process_rule":{"rules":{"pre_processing_rules":[{"id":"remove_extra_spaces","enabled":true},{"id":"remove_urls_emails","enabled":true}],"segmentation":{"separator":"###","max_tokens":500}},"mode":"custom"}}";type=text/plain' \
--form 'file=@"/path/to/file"'
```

CopyCopied!

### Response

```json
{
  "document": {
    "id": "",
    "position": 1,
    "data_source_type": "upload_file",
    "data_source_info": {
      "upload_file_id": ""
    },
    "dataset_process_rule_id": "",
    "name": "Dify.txt",
    "created_from": "api",
    "created_by": "",
    "created_at": 1695308667,
    "tokens": 0,
    "indexing_status": "waiting",
    "error": null,
    "enabled": true,
    "disabled_at": null,
    "disabled_by": null,
    "archived": false,
    "display_status": "queuing",
    "word_count": 0,
    "hit_count": 0,
    "doc_form": "text_model"
  },
  "batch": "20230921150427533684"
}
```

CopyCopied!

------



GET/datasets/{dataset_id}/documents/{batch}/indexing-status

## [获取文档嵌入状态（进度）](https://cloud.dify.ai/datasets?category=api#indexing_status)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

- - Name

    `batch`

  - Type

    string

  - Description

    上传文档的批次号

### Request

GET

/datasets/{dataset_id}/documents/{batch}/indexing-status

```
curl --location --request GET 'https://api.dify.ai/v1/datasets/{dataset_id}/documents/{batch}/indexing-status' \
--header 'Authorization: Bearer {api_key}'
```

CopyCopied!

### Response

```json
{
  "data":[{
    "id": "",
    "indexing_status": "indexing",
    "processing_started_at": 1681623462.0,
    "parsing_completed_at": 1681623462.0,
    "cleaning_completed_at": 1681623462.0,
    "splitting_completed_at": 1681623462.0,
    "completed_at": null,
    "paused_at": null,
    "error": null,
    "stopped_at": null,
    "completed_segments": 24,
    "total_segments": 100
  }]
}
```

CopyCopied!

------



DELETE/datasets/{dataset_id}/documents/{document_id}

## [删除文档](https://cloud.dify.ai/datasets?category=api#delete_document)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

- - Name

    `document_id`

  - Type

    string

  - Description

    文档 ID

### Request

DELETE

/datasets/{dataset_id}/documents/{document_id}

```
curl --location --request DELETE 'https://api.dify.ai/v1/datasets/{dataset_id}/documents/{document_id}' \
--header 'Authorization: Bearer {api_key}'
```

CopyCopied!

### Response

```text
204 No Content
```

CopyCopied!

------



GET/datasets/{dataset_id}/documents

## [知识库文档列表](https://cloud.dify.ai/datasets?category=api#dataset_document_list)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

### Query

- - Name

    `keyword`

  - Type

    string

  - Description

    搜索关键词，可选，目前仅搜索文档名称

- - Name

    `page`

  - Type

    string

  - Description

    页码，可选

- - Name

    `limit`

  - Type

    string

  - Description

    返回条数，可选，默认 20，范围 1-100

### Request

GET

/datasets/{dataset_id}/documents

```
curl --location --request GET 'https://api.dify.ai/v1/datasets/{dataset_id}/documents' \
--header 'Authorization: Bearer {api_key}'
```

CopyCopied!

### Response

```json
{
  "data": [
    {
      "id": "",
      "position": 1,
      "data_source_type": "file_upload",
      "data_source_info": null,
      "dataset_process_rule_id": null,
      "name": "dify",
      "created_from": "",
      "created_by": "",
      "created_at": 1681623639,
      "tokens": 0,
      "indexing_status": "waiting",
      "error": null,
      "enabled": true,
      "disabled_at": null,
      "disabled_by": null,
      "archived": false
    },
  ],
  "has_more": false,
  "limit": 20,
  "total": 9,
  "page": 1
}
```

CopyCopied!

------



GET/datasets/{dataset_id}/documents/{document_id}

## [获取文档详情](https://cloud.dify.ai/datasets?category=api#get-document-detail)

获取文档详情.

### Path

- `dataset_id` (string) 知识库 ID
- `document_id` (string) 文档 ID

### Query

- `metadata` (string) metadata 过滤条件 `all`, `only`, 或者 `without`. 默认是 `all`.

### Response

返回知识库文档的详情.

### Request Example

### Request

GET

/datasets/{dataset_id}/documents/{document_id}

```
curl -X GET 'https://api.dify.ai/v1/datasets/{dataset_id}/documents/{document_id}' \
-H 'Authorization: Bearer {api_key}'
```

CopyCopied!

### Response Example

### Response

```json
{
"id": "f46ae30c-5c11-471b-96d0-464f5f32a7b2", 
"position": 1, 
"data_source_type": "upload_file", 
"data_source_info": {
    "upload_file": {
        ...
    }
}, 
"dataset_process_rule_id": "24b99906-845e-499f-9e3c-d5565dd6962c", 
"dataset_process_rule": {
    "mode": "hierarchical", 
    "rules": {
        "pre_processing_rules": [
            {
                "id": "remove_extra_spaces", 
                "enabled": true
            }, 
            {
                "id": "remove_urls_emails", 
                "enabled": false
            }
        ], 
        "segmentation": {
            "separator": "**********page_ending**********", 
            "max_tokens": 1024, 
            "chunk_overlap": 0
        }, 
        "parent_mode": "paragraph", 
        "subchunk_segmentation": {
            "separator": "\n", 
            "max_tokens": 512, 
            "chunk_overlap": 0
        }
    }
}, 
"document_process_rule": {
    "id": "24b99906-845e-499f-9e3c-d5565dd6962c", 
    "dataset_id": "48a0db76-d1a9-46c1-ae35-2baaa919a8a9", 
    "mode": "hierarchical", 
    "rules": {
        "pre_processing_rules": [
            {
                "id": "remove_extra_spaces", 
                "enabled": true
            }, 
            {
                "id": "remove_urls_emails", 
                "enabled": false
            }
        ], 
        "segmentation": {
            "separator": "**********page_ending**********", 
            "max_tokens": 1024, 
            "chunk_overlap": 0
        }, 
        "parent_mode": "paragraph", 
        "subchunk_segmentation": {
            "separator": "\n", 
            "max_tokens": 512, 
            "chunk_overlap": 0
        }
    }
}, 
"name": "xxxx", 
"created_from": "web", 
"created_by": "17f71940-a7b5-4c77-b60f-2bd645c1ffa0", 
"created_at": 1750464191, 
"tokens": null, 
"indexing_status": "waiting", 
"completed_at": null, 
"updated_at": 1750464191, 
"indexing_latency": null, 
"error": null, 
"enabled": true, 
"disabled_at": null, 
"disabled_by": null, 
"archived": false, 
"segment_count": 0, 
"average_segment_length": 0, 
"hit_count": null, 
"display_status": "queuing", 
"doc_form": "hierarchical_model", 
"doc_language": "Chinese Simplified"
}
```

CopyCopied!

------

------



PATCH/datasets/{dataset_id}/documents/status/{action}

## [更新文档状态](https://cloud.dify.ai/datasets?category=api#batch_document_status)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

- - Name

    `action`

  - Type

    string

  - Description

    `enable` - 启用文档`disable` - 禁用文档`archive` - 归档文档`un_archive` - 取消归档文档

### Request Body

- - Name

    `document_ids`

  - Type

    array[string]

  - Description

    文档ID列表

### Request

PATCH

/datasets/{dataset_id}/documents/status/{action}

```
curl --location --request PATCH 'https://api.dify.ai/v1/datasets/{dataset_id}/documents/status/{action}' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "document_ids": ["doc-id-1", "doc-id-2"]
}'
```

CopyCopied!

### Response

```json
{
  "result": "success"
}
```

CopyCopied!

------



POST/datasets/{dataset_id}/documents/{document_id}/segments

## [新增分段](https://cloud.dify.ai/datasets?category=api#create_new_segment)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

- - Name

    `document_id`

  - Type

    string

  - Description

    文档 ID

### Request Body

- - Name

    `segments`

  - Type

    object list

  - Description

    `content` (text) 文本内容/问题内容，必填`answer` (text) 答案内容，非必填，如果知识库的模式为 Q&A 模式则传值`keywords` (list) 关键字，非必填

### Request

POST

/datasets/{dataset_id}/documents/{document_id}/segments

```
curl --location --request POST 'https://api.dify.ai/v1/datasets/{dataset_id}/documents/{document_id}/segments' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{"segments": [{"content": "1","answer": "1","keywords": ["a"]}]}'
```

CopyCopied!

### Response

```json
{
  "data": [{
    "id": "",
    "position": 1,
    "document_id": "",
    "content": "1",
    "answer": "1",
    "word_count": 25,
    "tokens": 0,
    "keywords": [
        "a"
    ],
    "index_node_id": "",
    "index_node_hash": "",
    "hit_count": 0,
    "enabled": true,
    "disabled_at": null,
    "disabled_by": null,
    "status": "completed",
    "created_by": "",
    "created_at": 1695312007,
    "indexing_at": 1695312007,
    "completed_at": 1695312007,
    "error": null,
    "stopped_at": null
  }],
  "doc_form": "text_model"
}
```

CopyCopied!

------



GET/datasets/{dataset_id}/documents/{document_id}/segments

## [查询文档分段](https://cloud.dify.ai/datasets?category=api#get_segment)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

- - Name

    `document_id`

  - Type

    string

  - Description

    文档 ID

### Query

- - Name

    `keyword`

  - Type

    string

  - Description

    搜索关键词，可选

- - Name

    `status`

  - Type

    string

  - Description

    搜索状态，completed

- - Name

    `page`

  - Type

    string

  - Description

    页码，可选

- - Name

    `limit`

  - Type

    string

  - Description

    返回条数，可选，默认 20，范围 1-100

### Request

GET

/datasets/{dataset_id}/documents/{document_id}/segments

```
curl --location --request GET 'https://api.dify.ai/v1/datasets/{dataset_id}/documents/{document_id}/segments' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json'
```

CopyCopied!

### Response

```json
{
  "data": [{
    "id": "",
    "position": 1,
    "document_id": "",
    "content": "1",
    "answer": "1",
    "word_count": 25,
    "tokens": 0,
    "keywords": [
        "a"
    ],
    "index_node_id": "",
    "index_node_hash": "",
    "hit_count": 0,
    "enabled": true,
    "disabled_at": null,
    "disabled_by": null,
    "status": "completed",
    "created_by": "",
    "created_at": 1695312007,
    "indexing_at": 1695312007,
    "completed_at": 1695312007,
    "error": null,
    "stopped_at": null
  }],
  "doc_form": "text_model",
  "has_more": false,
  "limit": 20,
  "total": 9,
  "page": 1
}
```

CopyCopied!

------



DELETE/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}

## [删除文档分段](https://cloud.dify.ai/datasets?category=api#delete_segment)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

- - Name

    `document_id`

  - Type

    string

  - Description

    文档 ID

- - Name

    `segment_id`

  - Type

    string

  - Description

    文档分段 ID

### Request

DELETE

/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}

```
curl --location --request DELETE 'https://api.dify.ai/v1/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json'
```

CopyCopied!

### Response

```text
204 No Content
```

CopyCopied!

------



GET/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}

## [查看文档分段详情](https://cloud.dify.ai/datasets?category=api#view_document_segment)

查看指定知识库中特定文档的分段详情

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

- - Name

    `document_id`

  - Type

    string

  - Description

    文档 ID

- - Name

    `segment_id`

  - Type

    string

  - Description

    分段 ID

### Request

GET

/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}

```
curl --location --request GET 'https://api.dify.ai/v1/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}' \
--header 'Authorization: Bearer {api_key}'
```

CopyCopied!

### Response

```json
{
  "data": {
    "id": "分段唯一ID",
    "position": 2,
    "document_id": "所属文档ID",
    "content": "分段内容文本",
    "sign_content": "签名内容文本",
    "answer": "答案内容(如果有)",
    "word_count": 470,
    "tokens": 382,
    "keywords": ["关键词1", "关键词2"],
    "index_node_id": "索引节点ID",
    "index_node_hash": "索引节点哈希值",
    "hit_count": 0,
    "enabled": true,
    "status": "completed",
    "created_by": "创建者ID",
    "created_at": 创建时间戳,
    "updated_at": 更新时间戳,
    "indexing_at": 索引时间戳,
    "completed_at": 完成时间戳,
    "error": null,
    "child_chunks": []
  },
  "doc_form": "text_model"
}
```

CopyCopied!

------



POST

## [更新文档分段](https://cloud.dify.ai/datasets?category=api#update_segment)

### POST

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

- - Name

    `document_id`

  - Type

    string

  - Description

    文档 ID

- - Name

    `segment_id`

  - Type

    string

  - Description

    文档分段 ID

### Request Body

- - Name

    `segment`

  - Type

    object

  - Description

    `content` (text) 文本内容/问题内容，必填`answer` (text) 答案内容，非必填，如果知识库的模式为 Q&A 模式则传值`keywords` (list) 关键字，非必填`enabled` (bool) false/true，非必填`regenerate_child_chunks` (bool) 是否重新生成子分段，非必填

### Request

POST

/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}

```
curl --location --request POST 'https://api.dify.ai/v1/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json'\
--data-raw '{"segment": {"content": "1","answer": "1", "keywords": ["a"], "enabled": false}}'
```

CopyCopied!

### Response

```json
{
  "data": {
    "id": "",
    "position": 1,
    "document_id": "",
    "content": "1",
    "answer": "1",
    "word_count": 25,
    "tokens": 0,
    "keywords": [
        "a"
    ],
    "index_node_id": "",
    "index_node_hash": "",
    "hit_count": 0,
    "enabled": true,
    "disabled_at": null,
    "disabled_by": null,
    "status": "completed",
    "created_by": "",
    "created_at": 1695312007,
    "indexing_at": 1695312007,
    "completed_at": 1695312007,
    "error": null,
    "stopped_at": null
  },
  "doc_form": "text_model"
}
```

CopyCopied!

------



POST/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks

## [新增文档子分段](https://cloud.dify.ai/datasets?category=api#create_child_chunk)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

- - Name

    `document_id`

  - Type

    string

  - Description

    文档 ID

- - Name

    `segment_id`

  - Type

    string

  - Description

    分段 ID

### Request Body

- - Name

    `content`

  - Type

    string

  - Description

    子分段内容

### Request

POST

/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks

```
curl --location --request POST 'https://api.dify.ai/v1/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{"content": "子分段内容"}'
```

CopyCopied!

### Response

```json
{
  "data": {
    "id": "",
    "segment_id": "",
    "content": "子分段内容",
    "word_count": 25,
    "tokens": 0,
    "index_node_id": "",
    "index_node_hash": "",
    "status": "completed",
    "created_by": "",
    "created_at": 1695312007,
    "indexing_at": 1695312007,
    "completed_at": 1695312007,
    "error": null,
    "stopped_at": null
  }
}
```

CopyCopied!

------



GET/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks

## [查询文档子分段](https://cloud.dify.ai/datasets?category=api#get_child_chunks)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

- - Name

    `document_id`

  - Type

    string

  - Description

    文档 ID

- - Name

    `segment_id`

  - Type

    string

  - Description

    分段 ID

### Query

- - Name

    `keyword`

  - Type

    string

  - Description

    搜索关键词（选填）

- - Name

    `page`

  - Type

    integer

  - Description

    页码（选填，默认1）

- - Name

    `limit`

  - Type

    integer

  - Description

    每页数量（选填，默认20，最大100）

### Request

GET

/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks

```
curl --location --request GET 'https://api.dify.ai/v1/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks?page=1&limit=20' \
--header 'Authorization: Bearer {api_key}'
```

CopyCopied!

### Response

```json
{
  "data": [{
    "id": "",
    "segment_id": "",
    "content": "子分段内容",
    "word_count": 25,
    "tokens": 0,
    "index_node_id": "",
    "index_node_hash": "",
    "status": "completed",
    "created_by": "",
    "created_at": 1695312007,
    "indexing_at": 1695312007,
    "completed_at": 1695312007,
    "error": null,
    "stopped_at": null
  }],
  "total": 1,
  "total_pages": 1,
  "page": 1,
  "limit": 20
}
```

CopyCopied!

------



DELETE/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks/{child_chunk_id}

## [删除文档子分段](https://cloud.dify.ai/datasets?category=api#delete_child_chunk)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

- - Name

    `document_id`

  - Type

    string

  - Description

    文档 ID

- - Name

    `segment_id`

  - Type

    string

  - Description

    分段 ID

- - Name

    `child_chunk_id`

  - Type

    string

  - Description

    子分段 ID

### Request

DELETE

/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks/{child_chunk_id}

```
curl --location --request DELETE 'https://api.dify.ai/v1/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks/{child_chunk_id}' \
--header 'Authorization: Bearer {api_key}'
```

CopyCopied!

### Response

```text
204 No Content
```

CopyCopied!

------

### 错误信息

- - Name

    `code`

  - Type

    string

  - Description

    返回的错误代码

- - Name

    `status`

  - Type

    number

  - Description

    返回的错误状态

- - Name

    `message`

  - Type

    string

  - Description

    返回的错误信息

### Example

```json
  {
    "code": "no_file_uploaded",
    "message": "Please upload your file.",
    "status": 400
  }
```

CopyCopied!

------



PATCH/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks/{child_chunk_id}

## [更新文档子分段](https://cloud.dify.ai/datasets?category=api#update_child_chunk)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

- - Name

    `document_id`

  - Type

    string

  - Description

    文档 ID

- - Name

    `segment_id`

  - Type

    string

  - Description

    分段 ID

- - Name

    `child_chunk_id`

  - Type

    string

  - Description

    子分段 ID

### Request Body

- - Name

    `content`

  - Type

    string

  - Description

    子分段内容

### Request

PATCH

/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks/{child_chunk_id}

```
curl --location --request PATCH 'https://api.dify.ai/v1/datasets/{dataset_id}/documents/{document_id}/segments/{segment_id}/child_chunks/{child_chunk_id}' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{"content": "更新的子分段内容"}'
```

CopyCopied!

### Response

```json
{
  "data": {
    "id": "",
    "segment_id": "",
    "content": "更新的子分段内容",
    "word_count": 25,
    "tokens": 0,
    "index_node_id": "",
    "index_node_hash": "",
    "status": "completed",
    "created_by": "",
    "created_at": 1695312007,
    "indexing_at": 1695312007,
    "completed_at": 1695312007,
    "error": null,
    "stopped_at": null
  }
}
```

CopyCopied!

------



GET/datasets/{dataset_id}/documents/{document_id}/upload-file

## [获取上传文件](https://cloud.dify.ai/datasets?category=api#get_upload_file)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

- - Name

    `document_id`

  - Type

    string

  - Description

    文档 ID

### Request

GET

/datasets/{dataset_id}/documents/{document_id}/upload-file

```
curl --location --request GET 'https://api.dify.ai/v1/datasets/{dataset_id}/documents/{document_id}/upload-file' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json'
```

CopyCopied!

### Response

```json
{
  "id": "file_id",
  "name": "file_name",
  "size": 1024,
  "extension": "txt",
  "url": "preview_url",
  "download_url": "download_url",
  "mime_type": "text/plain",
  "created_by": "user_id",
  "created_at": 1728734540,
}
```

CopyCopied!

------



POST/datasets/{dataset_id}/retrieve

## [检索知识库](https://cloud.dify.ai/datasets?category=api#dataset_retrieval)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

### Request Body

- - Name

    `query`

  - Type

    string

  - Description

    检索关键词

- - Name

    `retrieval_model`

  - Type

    object

  - Description

    检索参数（选填，如不填，按照默认方式召回）`search_method` (text) 检索方法：以下四个关键字之一，必填`keyword_search` 关键字检索`semantic_search` 语义检索`full_text_search` 全文检索`hybrid_search` 混合检索`reranking_enable` (bool) 是否启用 Reranking，非必填，如果检索模式为 semantic_search 模式或者 hybrid_search 则传值`reranking_mode` (object) Rerank 模型配置，非必填，如果启用了 reranking 则传值`reranking_provider_name` (string) Rerank 模型提供商`reranking_model_name` (string) Rerank 模型名称`weights` (float) 混合检索模式下语意检索的权重设置`top_k` (integer) 返回结果数量，非必填`score_threshold_enabled` (bool) 是否开启 score 阈值`score_threshold` (float) Score 阈值`metadata_filtering_conditions` (object) 元数据过滤条件`logical_operator` (string) 逻辑运算符: `and` | `or``conditions` (array[object]) 条件列表`name` (string) 元数据字段名`comparison_operator` (string) 比较运算符，可选值:字符串比较:`contains`: 包含`not contains`: 不包含`start with`: 以...开头`end with`: 以...结尾`is`: 等于`is not`: 不等于`empty`: 为空`not empty`: 不为空数值比较:`=`: 等于`≠`: 不等于`>`: 大于`< `: 小于`≥`: 大于等于`≤`: 小于等于时间比较:`before`: 早于`after`: 晚于`value` (string|number|null) 比较值

- - Name

    `external_retrieval_model`

  - Type

    object

  - Description

    未启用字段

### Request

POST

/datasets/{dataset_id}/retrieve

```
curl --location --request POST 'https://api.dify.ai/v1/datasets/{dataset_id}/retrieve' \
--header 'Authorization: Bearer {api_key}'\
--header 'Content-Type: application/json'\
--data-raw '{
  "query": "test",
  "retrieval_model": {
      "search_method": "keyword_search",
      "reranking_enable": false,
      "reranking_mode": null,
      "reranking_model": {
          "reranking_provider_name": "",
          "reranking_model_name": ""
      },
      "weights": null,
      "top_k": 1,
      "score_threshold_enabled": false,
      "score_threshold": null,
      "metadata_filtering_conditions": {
          "logical_operator": "and",
          "conditions": [
              {
                  "name": "document_name",
                  "comparison_operator": "contains",
                  "value": "test"
              }
          ]
      }
  }
}'
```

CopyCopied!

### Response

```json
{
  "query": {
    "content": "test"
  },
  "records": [
    {
      "segment": {
        "id": "7fa6f24f-8679-48b3-bc9d-bdf28d73f218",
        "position": 1,
        "document_id": "a8c6c36f-9f5d-4d7a-8472-f5d7b75d71d2",
        "content": "Operation guide",
        "answer": null,
        "word_count": 847,
        "tokens": 280,
        "keywords": [
          "install",
          "java",
          "base",
          "scripts",
          "jdk",
          "manual",
          "internal",
          "opens",
          "add",
          "vmoptions"
        ],
        "index_node_id": "39dd8443-d960-45a8-bb46-7275ad7fbc8e",
        "index_node_hash": "0189157697b3c6a418ccf8264a09699f25858975578f3467c76d6bfc94df1d73",
        "hit_count": 0,
        "enabled": true,
        "disabled_at": null,
        "disabled_by": null,
        "status": "completed",
        "created_by": "dbcb1ab5-90c8-41a7-8b78-73b235eb6f6f",
        "created_at": 1728734540,
        "indexing_at": 1728734552,
        "completed_at": 1728734584,
        "error": null,
        "stopped_at": null,
        "document": {
          "id": "a8c6c36f-9f5d-4d7a-8472-f5d7b75d71d2",
          "data_source_type": "upload_file",
          "name": "readme.txt",
        }
      },
      "score": 3.730463140527718e-05,
      "tsne_position": null
    }
  ]
}
```

CopyCopied!

------



POST/datasets/{dataset_id}/metadata

## [新增元数据](https://cloud.dify.ai/datasets?category=api#create_metadata)

### Params

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

### Request Body

- - Name

    `segment`

  - Type

    object

  - Description

    `type` (string) 元数据类型，必填`name` (string) 元数据名称，必填

### Request

POST

/datasets/{dataset_id}/metadata

```
curl --location --request POST 'https://api.dify.ai/v1/datasets/{dataset_id}/metadata' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json'\
--data-raw '{"type": "string", "name": "test"}'
```

CopyCopied!

### Response

```json
{
  "id": "abc",
  "type": "string",
  "name": "test",
}
```

CopyCopied!

------



PATCH/datasets/{dataset_id}/metadata/{metadata_id}

## [更新元数据](https://cloud.dify.ai/datasets?category=api#update_metadata)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

- - Name

    `metadata_id`

  - Type

    string

  - Description

    元数据 ID

### Request Body

- - Name

    `segment`

  - Type

    object

  - Description

    `name` (string) 元数据名称，必填

### Request

PATCH

/datasets/{dataset_id}/metadata/{metadata_id}

```
curl --location --request PATCH 'https://api.dify.ai/v1/datasets/{dataset_id}/metadata/{metadata_id}' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json'\
--data-raw '{"name": "test"}'
```

CopyCopied!

### Response

```json
{
  "id": "abc",
  "type": "string",
  "name": "test",
}
```

CopyCopied!

------



DELETE/datasets/{dataset_id}/metadata/{metadata_id}

## [删除元数据](https://cloud.dify.ai/datasets?category=api#delete_metadata)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

- - Name

    `metadata_id`

  - Type

    string

  - Description

    元数据 ID

### Request

DELETE

/datasets/{dataset_id}/metadata/{metadata_id}

```
curl --location --request DELETE 'https://api.dify.ai/v1/datasets/{dataset_id}/metadata/{metadata_id}' \
--header 'Authorization: Bearer {api_key}'
```

CopyCopied!

------



POST/datasets/{dataset_id}/metadata/built-in/{action}

## [启用/禁用内置元数据](https://cloud.dify.ai/datasets?category=api#toggle_metadata)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

- - Name

    `action`

  - Type

    string

  - Description

    disable/enable

### Request

POST

/datasets/{dataset_id}/metadata/built-in/{action}

```
curl --location --request POST 'https://api.dify.ai/v1/datasets/{dataset_id}/metadata/built-in/{action}' \
--header 'Authorization: Bearer {api_key}'
```

CopyCopied!

------



POST/datasets/{dataset_id}/documents/metadata

## [更新文档元数据](https://cloud.dify.ai/datasets?category=api#update_documents_metadata)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

### Request Body

- - Name

    `operation_data`

  - Type

    object list

  - Description

    `document_id` (string) 文档 ID`metadata_list` (list) 元数据列表`id` (string) 元数据 ID`value` (string) 元数据值`name` (string) 元数据名称

### Request

POST

/datasets/{dataset_id}/documents/metadata

```
curl --location --request POST 'https://api.dify.ai/v1/datasets/{dataset_id}/documents/metadata' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json'\
--data-raw '{"operation_data": [{"document_id": "document_id", "metadata_list": [{"id": "id", "value": "value", "name": "name"}]}]}'
```

CopyCopied!

------



GET/datasets/{dataset_id}/metadata

## [查询知识库元数据列表](https://cloud.dify.ai/datasets?category=api#dataset_metadata_list)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    知识库 ID

### Request

GET

/datasets/{dataset_id}/metadata

```
curl --location --request GET 'https://api.dify.ai/v1/datasets/{dataset_id}/metadata' \
--header 'Authorization: Bearer {api_key}'
```

CopyCopied!

### Response

```json
{
  "doc_metadata": [
    {
      "id": "",
      "name": "name",
      "type": "string",
      "use_count": 0,
    },
    ...
  ],
  "built_in_field_enabled": true
}
```

CopyCopied!

------



GET/workspaces/current/models/model-types/text-embedding

## [获取嵌入模型列表](https://cloud.dify.ai/datasets?category=api#model_type_list)

### Query

### Request

GET

/datasets/{dataset_id}

```
curl --location --location --request GET 'https://api.dify.ai/v1/workspaces/current/models/model-types/text-embedding' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' 
```

CopyCopied!

### Response

```json
{
  "data": [
      {
          "provider": "zhipuai",
          "label": {
              "zh_Hans": "智谱 AI",
              "en_US": "ZHIPU AI"
          },
          "icon_small": {
              "zh_Hans": "http://127.0.0.1:5001/console/api/workspaces/current/model-providers/zhipuai/icon_small/zh_Hans",
              "en_US": "http://127.0.0.1:5001/console/api/workspaces/current/model-providers/zhipuai/icon_small/en_US"
          },
          "icon_large": {
              "zh_Hans": "http://127.0.0.1:5001/console/api/workspaces/current/model-providers/zhipuai/icon_large/zh_Hans",
              "en_US": "http://127.0.0.1:5001/console/api/workspaces/current/model-providers/zhipuai/icon_large/en_US"
          },
          "status": "active",
          "models": [
              {
                  "model": "embedding-3",
                  "label": {
                      "zh_Hans": "embedding-3",
                      "en_US": "embedding-3"
                  },
                  "model_type": "text-embedding",
                  "features": null,
                  "fetch_from": "predefined-model",
                  "model_properties": {
                      "context_size": 8192
                  },
                  "deprecated": false,
                  "status": "active",
                  "load_balancing_enabled": false
              },
              {
                  "model": "embedding-2",
                  "label": {
                      "zh_Hans": "embedding-2",
                      "en_US": "embedding-2"
                  },
                  "model_type": "text-embedding",
                  "features": null,
                  "fetch_from": "predefined-model",
                  "model_properties": {
                      "context_size": 8192
                  },
                  "deprecated": false,
                  "status": "active",
                  "load_balancing_enabled": false
              },
              {
                  "model": "text_embedding",
                  "label": {
                      "zh_Hans": "text_embedding",
                      "en_US": "text_embedding"
                  },
                  "model_type": "text-embedding",
                  "features": null,
                  "fetch_from": "predefined-model",
                  "model_properties": {
                      "context_size": 512
                  },
                  "deprecated": false,
                  "status": "active",
                  "load_balancing_enabled": false
              }
          ]
      }
  ]
}
```

CopyCopied!

------



POST/datasets/tags

## [新增知识库类型标签](https://cloud.dify.ai/datasets?category=api#create_new_knowledge_tag)

### Request Body

- - Name

    `name`

  - Type

    string

  - Description

    (text) 新标签名称，必填，最大长度为 50

### Request

POST

/datasets/tags

```
curl --location --request POST 'https://api.dify.ai/v1/datasets/tags' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{"name": "testtag1"}'
```

CopyCopied!

### Response

```json
{
    "id": "eddb66c2-04a1-4e3a-8cb2-75abd01e12a6", 
    "name": "testtag1", 
    "type": "knowledge", 
    "binding_count": 0
}
```

CopyCopied!

------



GET/datasets/tags

## [获取知识库类型标签](https://cloud.dify.ai/datasets?category=api#get_knowledge_type_tags)

### Request Body

### Request

GET

/datasets/tags

```
curl --location --request GET 'https://api.dify.ai/v1/datasets/tags' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json'
```

CopyCopied!

### Response

```json
[
    {
        "id": "39d6934c-ed36-463d-b4a7-377fa1503dc0", 
        "name": "testtag1", 
        "type": "knowledge", 
        "binding_count": "0"
    }, 
    ...
]
```

CopyCopied!

------



PATCH/datasets/tags

## [修改知识库类型标签名称](https://cloud.dify.ai/datasets?category=api#modify_knowledge_tag_name)

### Request Body

- - Name

    `name`

  - Type

    string

  - Description

    (text) 修改后的标签名称，必填，最大长度为 50

- - Name

    `tag_id`

  - Type

    string

  - Description

    (text) 标签 ID，必填

### Request

PATCH

/datasets/tags

```
curl --location --request PATCH 'https://api.dify.ai/v1/datasets/tags' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{"name": "testtag2", "tag_id": "e1a0a3db-ee34-4e04-842a-81555d5316fd"}
```

CopyCopied!

### Response

```json
{
    "id": "eddb66c2-04a1-4e3a-8cb2-75abd01e12a6", 
    "name": "tag-renamed", 
    "type": "knowledge", 
    "binding_count": 0
}
```

CopyCopied!

------



DELETE/datasets/tags

## [删除知识库类型标签](https://cloud.dify.ai/datasets?category=api#delete_knowledge_tag)

### Request Body

- - Name

    `tag_id`

  - Type

    string

  - Description

    (text) 标签 ID，必填

### Request

DELETE

/datasets/tags

```
curl --location --request DELETE 'https://api.dify.ai/v1/datasets/tags' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{ "tag_id": "e1a0a3db-ee34-4e04-842a-81555d5316fd"}
```

CopyCopied!

### Response

```json
{"result": "success"}
```

CopyCopied!

------



POST/datasets/tags/binding

## [绑定知识库到知识库类型标签](https://cloud.dify.ai/datasets?category=api#bind_dataset_to_knowledge_tag)

### Request Body

- - Name

    `tag_ids`

  - Type

    list

  - Description

    (list) 标签 ID 列表，必填

- - Name

    `target_id`

  - Type

    string

  - Description

    (text) 知识库 ID，必填

### Request

POST

/datasets/tags/binding

```
curl --location --request POST 'https://api.dify.ai/v1/datasets/tags/binding' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{"tag_ids": ["65cc29be-d072-4e26-adf4-2f727644da29","1e5348f3-d3ff-42b8-a1b7-0a86d518001a"], "target_id": "a932ea9f-fae1-4b2c-9b65-71c56e2cacd6"}'
```

CopyCopied!

### Response

```json
{"result": "success"}
```

CopyCopied!

------



POST/datasets/tags/unbinding

## [解绑知识库和知识库类型标签](https://cloud.dify.ai/datasets?category=api#unbind_dataset_and_knowledge_tag)

### Request Body

- - Name

    `tag_id`

  - Type

    string

  - Description

    (text) 标签 ID，必填

- - Name

    `target_id`

  - Type

    string

  - Description

    (text) 知识库 ID，必填

### Request

POST

/datasets/tags/unbinding

```
curl --location --request POST 'https://api.dify.ai/v1/datasets/tags/unbinding' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{"tag_id": "1e5348f3-d3ff-42b8-a1b7-0a86d518001a", "target_id": "a932ea9f-fae1-4b2c-9b65-71c56e2cacd6"}'
```

CopyCopied!

### Response

```json
{"result": "success"}
```

CopyCopied!

------



POST/datasets/<uuid:dataset_id>/tags

## [查询知识库已绑定的标签](https://cloud.dify.ai/datasets?category=api#query_dataset_tags)

### Path

- - Name

    `dataset_id`

  - Type

    string

  - Description

    (text) 知识库 ID

### Request

POST

/datasets/<uuid:dataset_id>/tags

```
curl --location --request POST 'https://api.dify.ai/v1/datasets/<uuid:dataset_id>/tags' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
```

CopyCopied!

### Response

```json
{
  "data": 
    [
      {"id": "4a601f4f-f8a2-4166-ae7c-58c3b252a524", 
      "name": "123"
      }, 
      ...
    ], 
  "total": 3
}
```

CopyCopied!

------

### 错误信息

- - Name

    `code`

  - Type

    string

  - Description

    返回的错误代码

- - Name

    `status`

  - Type

    number

  - Description

    返回的错误状态

- - Name

    `message`

  - Type

    string

  - Description

    返回的错误信息

### Example

```json
  {
    "code": "no_file_uploaded",
    "message": "Please upload your file.",
    "status": 400
  }
```

CopyCopied!

| code                        | status | message                                                      |
| --------------------------- | ------ | ------------------------------------------------------------ |
| no_file_uploaded            | 400    | Please upload your file.                                     |
| too_many_files              | 400    | Only one file is allowed.                                    |
| file_too_large              | 413    | File size exceeded.                                          |
| unsupported_file_type       | 415    | File type not allowed.                                       |
| high_quality_dataset_only   | 400    | Current operation only supports 'high-quality' datasets.     |
| dataset_not_initialized     | 400    | The dataset is still being initialized or indexing. Please wait a moment. |
| archived_document_immutable | 403    | The archived document is not editable.                       |
| dataset_name_duplicate      | 409    | The dataset name already exists. Please modify your dataset name. |
| invalid_action              | 400    | Invalid action.                                              |
| document_already_finished   | 400    | The document has been processed. Please refresh the page or go to the document details. |
| document_indexing           | 400    | The document is being processed and cannot be edited.        |
| invalid_metadata            | 400    | The metadata content is incorrect. Please check and verify.  |