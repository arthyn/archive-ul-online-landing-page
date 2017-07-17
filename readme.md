#UL Landing Page Server

UL Landing Page Server front-end is built using SASS as it's main format for CSS. In addition to SASS, this project uses the Bootstrap framework to facilitate some of its components as well as to serve anyone who will be maintaining the website and its content. Javascript frameworks have been incorporated, but should be loaded conditionally based on the template/page. To work with this repo please follow the directions below:

##Setting up a Mac with Node/Grunt/Bower/Sass
Open the terminal and enter the following commands(the first command installs a command line installer to install node:
- ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
- brew install node
- npm install -g grunt grunt-cli bower

##Working with the current repository:
Enter these commands at the terminal from this repoistory's directory:
- git clone {repo-link}
- npm install
- bower install
- grunt serve *This serves as your local server that will serve your static HTML. This will compile SASS on the fly and live-reload changes to your browser*

Once this code is received development should commence on a new branch to mark the departure from static HTML to templated code. To work with SASS during the development of the CMS reconfiguring the Gruntfile may be necessary.

The app folder contains all HTML, SASS, JS, and assets. The command `grunt build` will concatenate, minify, and copy all files to the dist folder for serving up to a server.

If you have any questions please email me, Hunter, at [hmiller@bbrcreative.com](mailto:hmiller@bbrcreative.com) or call me at 337-233-1515.
