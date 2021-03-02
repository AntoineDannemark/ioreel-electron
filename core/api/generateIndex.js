const fs = require('fs');
const path = require('path');

const apiPath = path.resolve(__dirname, '../../src/api');
const destPath = path.join(apiPath, 'index.json');

const children = fs.readdirSync(apiPath, {withFileTypes: true});
const dirChildren = children.filter(f => f.isDirectory()).map(f => f.name);

// Initialize return object
let api = {
    entities: [],
    routes: [],
};

// Remove hidden directories (ie .git) & discard eventual non-entity folders by checking 
// presence of actions/, to avoid potential bugs if someone adds a new folder in /api/
const isEntityDir = dir => !dir.includes('.') && fs.existsSync(path.join(apiPath, dir, 'actions'));

dirChildren
    .filter(dir => isEntityDir(dir))
    .forEach(entityDir => {      
        // Push entity
        api.entities.push(entityDir);
        
        // Map over the action files and push the routes 
        let currentEntityActionsPath = path.join(apiPath, entityDir, 'actions'),
            actionFiles = fs.readdirSync(currentEntityActionsPath);
        
        actionFiles.forEach(file => {
            let actionName = file.split('.').shift();

            api.routes.push({
                entity: entityDir,
                action: actionName,
            })
        });
});

// Write new Api Index
fs.writeFileSync(destPath, JSON.stringify(api))