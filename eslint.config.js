module.exports = [
    {
        languageOptions: {
            "ecmaVersion": "latest"
        },
        rules: {
            "indent": ["error", 4, { "SwitchCase": 1 }],
            "no-tabs": ["error"],
            "array-bracket-spacing" : ["error", "always"],
            "comma-dangle": ["error", "never"],
            "comma-spacing": ["error", { "before": false, "after": true }],
            "space-in-parens": ["error", "always", { "exceptions": [] }],
            "computed-property-spacing": ["error", "always"],
            "brace-style" : ["error", "allman", { "allowSingleLine": true }],
            "no-trailing-spaces": "error",
            "padded-blocks": ["error", "never"],
            "prefer-const": "error",
            "space-before-function-paren": "error",
            "keyword-spacing": "error",
            "space-infix-ops": "error",
            "semi": "error",
            "curly": "error",
            "quotes": ["error", "double", { "allowTemplateLiterals": true }],
            "one-var-declaration-per-line": ["error", "always"],
            "no-multiple-empty-lines": ["error", { "max": 1 } ],
            "new-parens": "error",
            "lines-between-class-members": ["error", "always"],
            "key-spacing": ["error", {
                "multiLine": { "beforeColon": true, "afterColon": true },
                "align": { "beforeColon": true, "afterColon": true, "on": "colon" }
            }],
            "func-call-spacing": ["error", "never"]
        }
    }
];