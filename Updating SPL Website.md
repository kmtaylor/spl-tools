# Updating SPL Website

1) Download any candidate pictures provided by volunteer to the appropriate council folder in the `spl-data` repo
1) Ensure that the file name of each picture contains the candidate's full name (eg. for a candidate named `Joe Bloggs`, the file could be named `JoeBloggs.jpg` or `WardName_Joe_Bloggs.png`, etc)
1) Resize the pictures to 200px x 200px
1) Commit the pictures to the `spl-data` repo
1) Download CSV provided by a volunteer containing the candidate scores
1) Normalise the CSV using the "CSV Normaliser" tool (eg. `php csv-normaliser/main.php --input ~/Downloads/COUNCIL_NAME.csv --media ../spl-data/council-name --output ../spl-data/council-name/candidates.csv`)
1) Commit the candidates.csv file to the `spl-data` repo
1) Push commits in the `spl-data` repo to the Git server
1) SSH into the Streets People Love WordPress server
1) Pull the latest changes into the `spl-data` repo
1) Run the `bulk-media-upload.sh` script (eg `sudo ./bulk-media-upload.sh ../spl-data`)
1) Commit any added media .json files in the `spl-data` repo
1) Push commits in the `spl-data` repo to the Git server (use the `spl` git user)
1) Run the `make-council-pages.sh` script to regenerate all pages (eg `sudo ./make-council-pages.sh`) OR regenerate a single page (eg `sudo ./make-council-pages.sh "Council Name"`)
