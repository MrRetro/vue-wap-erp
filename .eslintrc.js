// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/essential', 'airbnb-base'],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    "CSS_RBRACE":0,
    "prefer-const": 0,
    "arrow-parens": 0, // 箭头函数用小括号括起来
    "arrow-spacing": 0, //= >的前/后括号
    quotes: ["error", "single"], // 引号
    "comma-dangle": ["error", "never"],
    "no-use-before-define": ["error", {variables: false}],
    "no-console": "off",
    "no-alert": "off",
    "arrow-body-style": "off", // 不限制箭头函数体使用大括号，但是参数必须用括号包裹（arrow-parens）
    "no-mixed-operators": "off", // 关闭限制不同操作符   开启时，单参数不加括号
    "eol-last": "off", // 非空文件末尾不强制保留一行空行
    "padded-blocks": "off", // 去掉块声明间距的限制
    "no-plusplus": "off", // 不禁止使用 ++ 和 --
    radix: ["error", "as-needed"], // 按需添加基数 parseInt('071', 8)
    "no-lonely-if": "off",
    "no-restricted-syntax": "off",
    camelcase: "off", // 不强制驼峰
    "quote-props": "off",
    "no-return-assign": "off", // 箭头函数支持返回赋值，如ref={r => this.xx = r}
    "no-unused-expressions": ["error", {allowShortCircuit: true}],
    "global-require": "off",
    "no-undef": "off", // alert
    "no-bitwise": "off",
    "object-curly-spacing": "off", // 花括号空格
    "guard-for-in": "off",
    "max-len": ["error", 160],
    "import/prefer-default-export": "off",
    "import/no-named-as-default": 0,
    "import/no-named-as-default-member": 0,
    "require-yield": 2,
    "yield-star-spacing": 1,
    'linebreak-style': ["off", "windows"],
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never'
    }],
    "no-param-reassign": 0,//禁止给参数重新赋值
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    // 'no-param-reassign': ['error', {
    //   props: true,
    //   ignorePropertyModificationsFor: [
    //     'state', // for vuex state
    //     'acc', // for reduce accumulators
    //     'e' // for e.returnvalue
    //   ]
    // }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  }
}
