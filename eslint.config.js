// eslint.config.js
// Impor modul-modul yang diperlukan untuk konfigurasi ESLint
import js from '@eslint/js'; // Aturan dasar JavaScript yang direkomendasikan
import globals from 'globals'; // Untuk mendefinisikan variabel global (misalnya browser)
import reactHooks from 'eslint-plugin-react-hooks'; // Plugin untuk aturan React Hooks
import reactRefresh from 'eslint-plugin-react-refresh'; // Plugin khusus untuk React Fast Refresh (Vite HMR)
import tseslint from 'typescript-eslint'; // Parser dan plugin untuk TypeScript
import react from 'eslint-plugin-react'; // Plugin untuk aturan React
import importPlugin from 'eslint-plugin-import'; // Plugin untuk aturan impor
import prettierPlugin from 'eslint-plugin-prettier'; // Plugin untuk menjalankan Prettier sebagai aturan ESLint
import prettierConfig from 'eslint-config-prettier'; // Konfigurasi untuk menonaktifkan aturan ESLint yang konflik dengan Prettier

// Ekspor konfigurasi ESLint menggunakan format flat config (direkomendasikan)
export default tseslint.config(
  {
    // Bagian ini mendefinisikan file atau direktori yang akan diabaikan oleh ESLint
    // 'dist' adalah direktori output build Anda, yang tidak perlu dilinting.
    // Anda bisa menambahkan 'components/ui/**' di sini jika tidak ingin melinting file Shadcn UI secara detail.
    ignores: ['dist'],
  },
  {
    // Bagian ini mendefinisikan konfigurasi untuk file-file TypeScript dan TSX
    files: ['**/*.{ts,tsx}'],

    // 'extends' digunakan untuk mewarisi set aturan dari konfigurasi lain
    extends: [
      js.configs.recommended, // Aturan dasar JavaScript yang direkomendasikan
      ...tseslint.configs.recommended, // Aturan TypeScript ESLint yang direkomendasikan
      react.configs.recommended, // Aturan React yang direkomendasikan
      reactHooks.configs.recommended, // Aturan React Hooks yang direkomendasikan
      // 'prettierConfig' harus selalu menjadi yang terakhir di 'extends'
      // Ini menonaktifkan semua aturan ESLint yang mungkin konflik dengan Prettier,
      // sehingga Prettier menjadi satu-satunya sumber kebenaran untuk format kode.
      prettierConfig,
    ],

    // Opsi bahasa untuk parser dan lingkungan eksekusi kode
    languageOptions: {
      ecmaVersion: 2020, // Mengatur versi ECMAScript yang akan di-parse
      sourceType: 'module', // Mengatur kode sebagai ES Modules (menggunakan import/export)
      globals: {
        ...globals.browser, // Mendefinisikan variabel global lingkungan browser (misalnya window, document)
      },
      parser: tseslint.parser, // Menggunakan parser TypeScript ESLint untuk memahami kode TypeScript
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Mengaktifkan dukungan untuk JSX
        },
        // Penting: Mengatur 'project' agar ESLint dapat melakukan linting yang sadar tipe data (type-aware linting)
        // Ini memungkinkan ESLint untuk memeriksa masalah yang hanya bisa dideteksi dengan informasi tipe data.
        project: './tsconfig.json',
      },
    },

    // Mendefinisikan plugin ESLint yang akan digunakan
    plugins: {
      react, // Plugin React
      'react-hooks': reactHooks, // Plugin React Hooks
      'react-refresh': reactRefresh, // Plugin React Refresh (untuk Vite HMR)
      import: importPlugin, // Plugin Import
      prettier: prettierPlugin, // Plugin Prettier
    },

    // Pengaturan khusus untuk plugin
    settings: {
      react: {
        version: 'detect', // Secara otomatis mendeteksi versi React yang terinstal
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'], // Ekstensi file yang akan diresolusi oleh resolver node
        },
        alias: {
          map: [['@', './src']], // Memetakan alias '@/' ke direktori './src'
          extensions: [
            '.ts',
            '.tsx',
            '.js',
            '.jsx',
            '.json',
            '.svg',
            '.png',
            '.jpg',
          ], // Ekstensi file yang akan diresolusi oleh resolver alias
        },
      },
    },

    // Aturan-aturan ESLint yang spesifik untuk konfigurasi ini
    rules: {
      // Aturan ESLint Umum
      'no-unused-vars': 'off', // Matikan aturan dasar 'no-unused-vars'
      // Aturan TypeScript ESLint (lebih baik menggunakan versi TypeScript untuk 'no-unused-vars')
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off', // Memungkinkan penggunaan tipe 'any' (bisa diubah menjadi 'warn' atau 'error' jika Anda ingin lebih ketat)
      '@typescript-eslint/ban-ts-comment': 'off', // Memungkinkan penggunaan komentar seperti '@ts-ignore', '@ts-expect-error' (bisa diubah)

      // Aturan React
      // 'react/react-in-jsx-scope' dan 'react/jsx-uses-react' dimatikan karena tidak diperlukan di React 17+
      // dengan fitur JSX transform baru.
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off', // PropTypes tidak diperlukan saat menggunakan TypeScript untuk validasi prop

      // Aturan React Refresh (khusus untuk Vite HMR)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }, // Mengizinkan ekspor konstan dari komponen (misalnya React.memo)
      ],

      // Aturan Plugin Import
      'import/no-unresolved': 'error', // Memastikan semua impor dapat diresolusi dengan benar
      'import/order': [
        // Mengatur urutan impor
        'error',
        {
          groups: [
            'builtin', // Modul bawaan Node.js
            'external', // Modul dari node_modules
            'internal', // Impor internal (misalnya alias seperti @/)
            ['parent', 'sibling'], // Impor relatif (../, ./ )
            'index', // index.js dari sebuah folder
            'object', // Destructuring objek
          ],
          'newlines-between': 'always', // Selalu ada baris kosong di antara grup impor
          pathGroups: [
            {
              pattern: '@/**', // Aturan khusus untuk alias @/
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc', // Urutkan impor secara alfabetis
            caseInsensitive: true, // Pengurutan tidak peka huruf besar/kecil
          },
        },
      ],

      // Aturan Prettier
      // Ini adalah aturan penting yang menjalankan Prettier sebagai bagian dari proses linting.
      // Jika ada masalah format yang dideteksi oleh Prettier, ESLint akan melaporkannya sebagai kesalahan.
      'prettier/prettier': 'error',
    },
  }
);
