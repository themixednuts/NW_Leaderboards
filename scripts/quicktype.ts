import {
    quicktype,
    InputData,
    jsonInputForTargetLanguage,
    JSONSchemaInput,
    FetchingJSONSchemaStore,
} from "quicktype-core"

export async function quicktypeJSON(targetLanguage: Parameters<typeof jsonInputForTargetLanguage>[0],
    typeName: Parameters<ReturnType<typeof jsonInputForTargetLanguage>['addSource']>[0]['name'],
    jsonString: Parameters<ReturnType<typeof jsonInputForTargetLanguage>['addSource']>[0]['samples'][number],
    options?: Omit<Parameters<typeof quicktype>[0], 'lang' | 'inputData'>) {
    const jsonInput = jsonInputForTargetLanguage(targetLanguage)

    // We could add multiple samples for the same desired
    // type, or many sources for other types. Here we're
    // just making one type from one piece of sample JSON.
    await jsonInput.addSource({
        name: typeName,
        samples: [jsonString]
    })

    const inputData = new InputData()
    inputData.addInput(jsonInput)

    return await quicktype({
        ...options,
        inputData,
        lang: targetLanguage,
    })
}

export async function quicktypeJSONSchema(targetLanguage: Parameters<typeof quicktype>[0]['lang'],
    typeName: Parameters<InstanceType<typeof JSONSchemaInput>['addSource']>[0]['name'],
    jsonSchemaString: Parameters<InstanceType<typeof JSONSchemaInput>['addSource']>[0]['schema'],
    options?: Omit<Parameters<typeof quicktype>[0], 'lang' | 'inputData'>) {
    const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore())

    // We could add multiple schemas for multiple types,
    // but here we're just making one type from JSON schema.
    await schemaInput.addSource({ name: typeName, schema: jsonSchemaString })

    const inputData = new InputData()
    inputData.addInput(schemaInput)

    return await quicktype({
        ...options,
        inputData,
        lang: targetLanguage,
    })
}