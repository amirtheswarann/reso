COMPANY_INFO_EXTRACTION_SCHEMA = {
    "type": "object",
    "title": "company_info",
    "properties": {
        "name": {"type": "string", "description": "Official company name"},
        "description": {
            "type": "string",
            "description": "Brief description of the company and its activities",
        },
        "website": {
            "type": "string",
            "format": "uri",
            "description": "Company's official website URL",
        },
        "crunchbase_profile": {
            "type": "string",
            "format": "uri",
            "description": "Company's Crunchbase profile URL",
        },
        "year_founded": {
            "type": "integer",
            "minimum": 1800,
            "description": "Year when the company was founded",
        },
        "ceo": {"type": "string", "description": "Name of the company's CEO"},
        "total_funding_mm_usd": {
            "type": "number",
            "minimum": 0,
            "description": "Total funding raised in millions of USD",
        },
        "latest_round": {
            "type": "string",
            "description": "Type of the most recent funding round (e.g., Series A, Seed, etc.)",
        },
        "latest_round_date": {
            "type": "string",
            "format": "date",
            "description": "Date of the most recent funding round (YYYY-MM-DD)",
        },
        "latest_round_amount_mm_usd": {
            "type": "number",
            "minimum": 0,
            "description": "Amount raised in the most recent funding round in millions of USD",
        },
    },
    "required": [
        "name",
        "description",
        "website",
        "crunchbase_profile",
        "year_founded",
        "ceo",
        "total_funding_mm_usd",
        "latest_round",
        "latest_round_date",
        "latest_round_amount_mm_usd",
    ],
    "description": "Company information",
}