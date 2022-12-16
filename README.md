# Holberston School - What Is Outside

## Database Setup
Once the repo is cloned:

- Make sure MySQL is installed: `sudo apt install mysql-server`
- Run the scripts in this order: `mysql < setup_mysql.sql`, `python3 load_data.py`, `update_tables.sql`
## Run the server

- Start the server in the /api folder: `python3 app.py`

## Frontend

In a browser, go to `localhost:8000/home`

Register a fake account, then the page will show each episdoe fo Joy of Painting.

Multiple options are able to be selected for each category. Once the desired choices are selected, click the submit button, and the list will be filtered to the desired options.

When the submit button is clicked, a query is sent to the API, such as the one shown below.

Example query: `http://0.0.0.0:3000/filter?match=1&months=January&months=March&colors=Bright_Red&colors=Prussian_Blue&subject=cabin`

The query will return a JSON result with the episodes' information, which is then used through JQuery to popualate the filtered list of episodes.