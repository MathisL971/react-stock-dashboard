  export interface Env {
	FINNHUB_API_KEY: string;
  }
  
  export interface Stock {
	currency: string;
	description: string;
	displaySymbol: string;
	figi: string;
	mic: string;
	symbol: string;
	type: string;
  }

  export interface StockSymbol {
	description: string;
	displaySymbol: string;
	symbol: string;
	type: string;
  }
  
  export default {
	async fetch(
	  request: Request,
	  env: Env
	): Promise<Response> {
	  // Parse URL for routing
	  const url = new URL(request.url);
	  const path = url.pathname;
	  
	  switch (path) {
		case '/':
			return new Response('Hello World!');
		case '/api/stocks':
			return this.handleStocksRoute(request, env);
		case '/api/stock/lookup':
			return this.handleStockLookupRoute(request, env);
		case '/api/stock/quote':
			return this.handleStockQuoteRoute(request, env);
		case '/api/market-status':
			return this.handleMarketStatusRoute(request, env);
		default:
			break;
	  }
	  
	  // Handle 404 for unmatched routes
	  return new Response(
		JSON.stringify({ error: 'Not found' }),
		{ 
		  status: 404,
		  headers: { 'Content-Type': 'application/json' }
		}
	  );
	},
	
	// Handler for /api/stocks endpoint
	async handleStocksRoute(
	  request: Request,
	  env: Env
	): Promise<Response> {
	  // Only allow GET requests
	  if (request.method !== 'GET') {
		return new Response(
		  JSON.stringify({ error: 'Method not allowed' }),
		  { 
			status: 405,
			headers: { 
			  'Content-Type': 'application/json',
			  'Allow': 'GET'
			}
		  }
		);
	  }
	  
	  // Parse URL and get the exchange parameter
	  const url = new URL(request.url);
	  const exchange = url.searchParams.get('exchange');
  
	  // Validate exchange parameter
	  if (!exchange) {
		return new Response(
		  JSON.stringify({ error: 'Missing exchange parameter' }), 
		  { 
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		  }
		);
	  }
  
	  // Check for API key in environment
	  if (!env.FINNHUB_API_KEY) {
		return new Response(
		  JSON.stringify({ error: 'API key not configured' }), 
		  { 
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		  }
		);
	  }
  
	  try {
		// Fetch stock symbols from Finnhub API
		const apiUrl = `https://finnhub.io/api/v1/stock/symbol?exchange=${exchange}&token=${env.FINNHUB_API_KEY}`;
		const finnhubResponse = await fetch(apiUrl);
		
		if (!finnhubResponse.ok) {
		  const errorText = await finnhubResponse.text();
		  throw new Error(`Finnhub API error: ${finnhubResponse.status} - ${errorText}`);
		}
		
		const data: Stock[] = await finnhubResponse.json();
		
		// Return the index as JSON
		return new Response(
		  JSON.stringify(data),
		  {
			headers: {
			  'Content-Type': 'application/json',
			  'Cache-Control': 'max-age=3600', // Cache for 1 hour
			  'Access-Control-Allow-Origin': '*', // Add CORS support
			}
		  }
		);
	  } catch (error) {
		console.error('Error fetching stock symbols:', error);
		
		return new Response(
		  JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
		  { 
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		  }
		);
	  }
	},

	// Handler for /api/stock/lookup endpoint
	async handleStockLookupRoute(
	  request: Request,
	  env: Env
	): Promise<Response> {
	  // Only allow GET requests
	  if (request.method !== 'GET') {
		return new Response(
		  JSON.stringify({ error: 'Method not allowed' }),
		  { 
			status: 405,
			headers: { 
			  'Content-Type': 'application/json',
			  'Allow': 'GET'
			}
		  }
		);
	  }
  
	  // Parse URL and get the symbol parameter
	  const url = new URL(request.url);
	  const query = url.searchParams.get('query');
	  const exchange = url.searchParams.get('exchange');

	  // Validate query parameter
	  if (!query) {
		return new Response(
		  JSON.stringify({ error: 'Missing query parameter' }), 
		  { 
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		  }
		);
	  }

	  // Check for API key in environment
	  if (!env.FINNHUB_API_KEY) {
		return new Response(
		  JSON.stringify({ error: 'API key not configured' }), 
		  { 
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		  }
		);
	  }

	  try {
		// Fetch stock symbols from Finnhub API
		const apiUrl = `https://finnhub.io/api/v1/search?q=${query}&token=${env.FINNHUB_API_KEY}${exchange ? `&exchange=${exchange}` : ''}`;
		const finnhubResponse = await fetch(apiUrl);
		
		if (!finnhubResponse.ok) {
		  const errorText = await finnhubResponse.text();
		  throw new Error(`Finnhub API error: ${finnhubResponse.status} - ${errorText}`);
		}
		
		const data: StockSymbol[] = await finnhubResponse.json();
		
		// Return the data
		return new Response(
		  JSON.stringify(data),
		  { 
			headers: { 
			  'Content-Type': 'application/json',
			  'Cache-Control': 'max-age=3600', // Cache for 1 hour
			  'Access-Control-Allow-Origin': '*' // Add CORS support
			}
		  }
		);
	  } catch (error) {
		console.error('Error fetching stock symbols:', error);
		
		return new Response(
		  JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
		  { 
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		  }
		);
	  }
	},

	async handleStockQuoteRoute(
		request: Request,
		env: Env
	): Promise<Response> {
		// Only allow GET requests
		if (request.method !== 'GET') {
			return new Response(
				JSON.stringify({ error: 'Method not allowed' }),
				{ 
					status: 405,
					headers: { 
						'Content-Type': 'application/json',
						'Allow': 'GET'
					}
				}
			);
		}

		// Parse URL and get the symbol parameter
		const url = new URL(request.url);
		const symbol = url.searchParams.get('symbol');
  
		// Validate symbol parameter
		if (!symbol) {
			return new Response(
				JSON.stringify({ error: 'Missing symbol parameter' }), 
				{ 
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		// Check for API key in environment
		if (!env.FINNHUB_API_KEY) {
			return new Response(
				JSON.stringify({ error: 'API key not configured' }), 
				{ 
					status: 500,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}
  
		try {
			// Fetch stock quote from Finnhub API
			const apiUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${env.FINNHUB_API_KEY}`;
			const finnhubResponse = await fetch(apiUrl);
			
			if (!finnhubResponse.ok) {
				const errorText = await finnhubResponse.text();
				throw new Error(`Finnhub API error: ${finnhubResponse.status} - ${errorText}`);
			} 

			const data = await finnhubResponse.json();
			
			// Return the data
			return new Response(
				JSON.stringify(data),
				{ 
					headers: { 
						'Content-Type': 'application/json',
						'Cache-Control': 'max-age=3600', // Cache for 1 hour
						'Access-Control-Allow-Origin': '*' // Add CORS support
					}
				}
			);
		} catch (error) {
			console.error('Error fetching stock quote:', error);
			
			return new Response(
				JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
				{ 
					status: 500,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}
	},

	async handleMarketStatusRoute(
		request: Request,
		env: Env
	): Promise<Response> {
		// Only allow GET requests
		if (request.method !== 'GET') {
			return new Response(
				JSON.stringify({ error: 'Method not allowed' }),
				{ 
					status: 405,
					headers: { 
						'Content-Type': 'application/json',
						'Allow': 'GET'
					}
				}
			);
		}

		// Parse URL and get the exchange parameter
		const url = new URL(request.url);
		const exchange = url.searchParams.get('exchange');
  
		// Validate exchange parameter
		if (!exchange) {
			return new Response(
				JSON.stringify({ error: 'Missing exchange parameter' }), 
				{ 
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}

		// Check for API key in environment
		if (!env.FINNHUB_API_KEY) {
			return new Response(
				JSON.stringify({ error: 'API key not configured' }), 
				{ 
					status: 500,
					headers: { 'Content-Type': 'application/json' }
				}
			);
		}
  
		// Fetch market status from Finnhub API
		const apiUrl = `https://finnhub.io/api/v1/stock/market-status?exchange=${exchange}&token=${env.FINNHUB_API_KEY}`;
		const finnhubResponse = await fetch(apiUrl);
		
		if (!finnhubResponse.ok) {
			const errorText = await finnhubResponse.text();
			throw new Error(`Finnhub API error: ${finnhubResponse.status} - ${errorText}`);
		} 

		const data = await finnhubResponse.json();
		
		// Return the data
		return new Response(
			JSON.stringify(data),
			{ 
				headers: { 
					'Content-Type': 'application/json',
					'Cache-Control': 'max-age=3600', // Cache for 1 hour
					'Access-Control-Allow-Origin': '*' // Add CORS support
				}
			}
		);	
	},
  }

  