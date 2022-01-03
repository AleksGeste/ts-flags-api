# ts-flags-api

### setup and installation
1. `npm --init`
2. `tsc init`
3. `npm install -—save-dev lite-server`
4. Add script to package file by `"start": "lite-server"` in script section
5. Run server by typing in terminal `npm start`
6. Compile ts files by `tsc -w`
7. See result in the browser console
8. Installing Prettier for the project by `npm install prettier --save-dev` and create config file `.prettierrc`
9. Example of prettier configurations
```
{
  "singleQuote": true,
  "arrowParens": "avoid",
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "bracketSpacing": true
}
```
10. `npm install --save-dev webpack webpack-cli webpack-dev-server typescript ts-loader`
11. Create webpack.config.js and webpack.config.prod.js file and configure them
12. Add scripts to the package.json file

### upload to server
1. create droplet
2. setup nginx server
3. go to www folder
4. git clone repo
5. run `npm i`
6. run `npm run build`
