# Taggable Destination Tile Data Extractor

Extract the destination data from Excel (3 spreadsheets),
link it to Master Hotel & Geonames tags
and insert a `.json` file into S3 for indexing by ElasticSearch & Neo4J.


## Why?

Our *hypothesis* is that showing ***destination tiles*** to people
searching for holidays will ***inspire*** them to want to *visit* the place.

![destinations tile design](https://cloud.githubusercontent.com/assets/194400/15781877/ff8e07fa-299f-11e6-817a-3d5735393112.png)


## What?

This project (*script*) performs the following steps:
+ extract the data (*given to us in spreadsheets*) by Jesper
+ formats the data as `.json`
+ tags each destination tile with the relevant Geonames tag
(*so that it will appear in the search results when people search for that location*)

## How?

### tl;dr


### *Required* Environment Variables

In order to save the Destination Tiles to S3 (_via_ [`lambda-taggable-createDocument`](https://github.com/numo-labs/lambda-taggable-createDocument) )
you will need to have the following Environment variables:

```sh
export AWS_REGION=eu-west-1
export AWS_IAM_ROLE=arn:aws:iam::847002989232:role/lambdafull
export AWS_ACCESS_KEY_ID=yourId
export AWS_SECRET_ACCESS_KEY=yourKey
```
> get them from CodeShip: https://codeship.com/projects/149758/configure_environment

Either *export* the Environment Variables
***or*** create a file called `.env` in the root of the project
and paste them into the file.


<br />

## Detailed Steps to *Reperform* the "ETL"

> if you get new destination data, this will come in handy


### Step 1 - Open the `.xlsx` files to *understand* the Data

Jesper sent us 3 excel files:

![jesper-sent-us-the-data](https://cloud.githubusercontent.com/assets/194400/15782380/ee43d84c-29a1-11e6-978e-49384c722d9e.png)

![numo-destination-files](https://cloud.githubusercontent.com/assets/194400/15782076/bd0edf3e-29a0-11e6-9f4c-27484c96a7eb.png)

#### IS - Areas DA v1.xlsx (Location Info)

Contains the name of the area, a Hotel ID and Lat/Lon info

![numo-areas](https://cloud.githubusercontent.com/assets/194400/15782213/5022c2a4-29a1-11e6-80dc-470d5f7d70df.png)

| Index: | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|--------|---|---|---|---|---|---|---|---|---|
| Column Name: | AreaName | WVitemID | CAitemID | Latitude | Longitude | ExtentLatMin | ExtentLongMin | ExtentLatMax | ExtentLongMax |

#### IS - Area texts DA v1.xlsx (Text)

Contains the text content

![numo-destinations-area-text](https://cloud.githubusercontent.com/assets/194400/15782439/3a993b74-29a2-11e6-8046-c64abd03a0f3.png)

| Index: | 0 | 1 | 2 | 3 | 4 | 5 |
|--------|---|---|---|---|---|---|
| Column Name: | AreaName | WVitemID | TextTypeID | TextType | SortOrder | Text |

#### IS - Area images DA v1.xlsx (Images)

Contains a list of images for a given area/hotel

![numo-area-images](https://cloud.githubusercontent.com/assets/194400/15782092/d0740252-29a0-11e6-87f6-683cf418f660.png)

| Index: | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|--------|---|---|---|---|---|---|---|---|---|
| Column Name: | AreaName | WVitemID | ImageURL | ScreenSizeID | SortOrder | ScreenSizeName | Width | Height | ImageText |

<br />

### Step 2 - Export the `.xlsx` files as `.csv`

For each excel spreadsheet, save the file as csv:

![excel-save-as](https://cloud.githubusercontent.com/assets/194400/15784093/deec19c0-29a8-11e6-92bb-57ddff649df7.png)
s
> I changed the filenames to not have any spaces ...

![excel-save-as-csv](https://cloud.githubusercontent.com/assets/194400/15784143/1b0f611e-29a9-11e6-834d-485a3c56a34a.png)

> By default excel creates 3 sheets for all spreadsheets,
we only want to save the *first* one as `.csv`

![excel-save-active-sheet](https://cloud.githubusercontent.com/assets/194400/15784239/94936c1a-29a9-11e6-9c5f-ec0f06112e0d.png)

> Don't worry, Redmond, we *know* what we're doing...

![excel-save-darnit](https://cloud.githubusercontent.com/assets/194400/15784781/f819b04e-29ab-11e6-8037-7543e1b3da25.png)


### Step 3 - Parse the `.csv` files into a *useable* format > `.json`

Thankfully, we've done this [*before*](https://github.com/numo-labs/taggable-master-hotel-mapping-script/blob/master/lib/parse_master_hotel_records_csv_dump_script.js)
so we can re-cycle code:
http://stackoverflow.com/questions/36288375/how-to-parse-csv-data-that-contains-newlines-in-field-using-javascript
