import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class Copyseeker implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Copyseeker',
		name: 'copyseeker',
		icon: 'file:copyseeker.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Reverse image search and copyright analysis',
		defaults: {
			name: 'Copyseeker',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'copyseekerApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Reverse Image Search',
						value: 'reverseSearch',
						description: 'Find where an image appears online',
						action: 'Perform reverse image search',
					},
					{
						name: 'Site-Specific Search',
						value: 'siteSearch',
						description: 'Search for image on a specific website',
						action: 'Search specific site for image',
					},
				],
				default: 'reverseSearch',
			},
			{
				displayName: 'Image URL',
				name: 'imageUrl',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'https://example.com/image.jpg',
				description: 'Direct URL to the image file (JPG, PNG, GIF, WebP)',
			},
			{
				displayName: 'Target Site',
				name: 'targetSite',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['siteSearch'],
					},
				},
				required: true,
				placeholder: 'example.com',
				description: 'Domain to search (e.g., "example.com" without protocol)',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Return Full Response',
						name: 'fullResponse',
						type: 'boolean',
						default: false,
						description: 'Whether to return the complete API response or simplified data',
					},
					{
						displayName: 'Filter by Minimum Rank',
						name: 'minRank',
						type: 'number',
						default: 0,
						typeOptions: {
							minValue: 0,
							maxValue: 10,
							numberStepSize: 0.1,
						},
						description: 'Filter results in n8n to only include pages with rank above this value (0-10). This is applied after the API call.',
					},
					{
						displayName: 'Include Visual Similar Images',
						name: 'includeVisuallySimilar',
						type: 'boolean',
						default: true,
						description: 'Whether to include visually similar images in the response',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const imageUrl = this.getNodeParameter('imageUrl', i) as string;
				const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as {
					fullResponse?: boolean;
					minRank?: number;
					includeVisuallySimilar?: boolean;
				};

				const params: { [key: string]: string } = {
					imageUrl,
				};

				if (operation === 'siteSearch') {
					const targetSite = this.getNodeParameter('targetSite', i) as string;
					params.targetSite = targetSite;
				}

				const queryString = new URLSearchParams(params).toString();
				const url = `https://reverse-image-search-by-copyseeker.p.rapidapi.com/?${queryString}`;

				const options = {
					method: 'GET' as const,
					url: url,
					json: true,
				};

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'copyseekerApi',
					options,
				);

				let filteredResponse = { ...response };

				if (additionalOptions.minRank !== undefined && additionalOptions.minRank > 0) {
					if (filteredResponse.Pages) {
						filteredResponse.Pages = filteredResponse.Pages.filter(
							(page: any) => page.Rank >= (additionalOptions.minRank as number),
						);
					}
				}

				if (additionalOptions.includeVisuallySimilar === false) {
					delete filteredResponse.VisuallySimilar;
				}

				if (additionalOptions.fullResponse) {
					returnData.push({
						json: filteredResponse,
						pairedItem: i,
					});
				} else {
					const simplifiedData = {
						bestGuess: filteredResponse.BestGuessLabel || 'Unknown',
						totalMatches: filteredResponse.Pages?.length || 0,
						highestRankedSource: filteredResponse.Pages?.[0]
							? {
									url: filteredResponse.Pages[0].Url,
									title: filteredResponse.Pages[0].Title,
									rank: filteredResponse.Pages[0].Rank,
							  }
							: null,
						topEntities: filteredResponse.Entities?.slice(0, 3).map((e: any) => e.Description) || [],
						visuallySimilarCount: filteredResponse.VisuallySimilar?.length || 0,
						allPages: filteredResponse.Pages || [],
						entities: filteredResponse.Entities || [],
						visuallySimilar: filteredResponse.VisuallySimilar || [],
					};

					returnData.push({
						json: simplifiedData,
						pairedItem: i,
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: i,
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), (error as Error).message, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
