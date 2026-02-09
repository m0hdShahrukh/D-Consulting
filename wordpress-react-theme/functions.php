<?php
/**
 * Theme setup for D Consulting React Builder.
 */

if (!defined('DCRB_THEME_VERSION')) {
    define('DCRB_THEME_VERSION', '0.1.0');
}

if (!defined('DCRB_BUILDER_PAGE_SLUG')) {
    define('DCRB_BUILDER_PAGE_SLUG', 'dcrb-builder');
}

function dcrb_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('menus');
    add_theme_support('editor-styles');
    add_theme_support('responsive-embeds');
    load_theme_textdomain('d-consulting-react-builder', get_template_directory() . '/languages');

    register_nav_menus([
        'primary' => __('Primary Menu', 'd-consulting-react-builder'),
        'footer' => __('Footer Menu', 'd-consulting-react-builder'),
    ]);
}
add_action('after_setup_theme', 'dcrb_theme_setup');

function dcrb_enqueue_assets() {
    $theme_uri = get_template_directory_uri();
    $theme_dir = get_template_directory();

    wp_enqueue_style(
        'dcrb-theme-style',
        $theme_uri . '/style.css',
        [],
        DCRB_THEME_VERSION
    );

    $asset_path = $theme_dir . '/build/index.asset.php';
    $asset_data = file_exists($asset_path) ? include $asset_path : ['dependencies' => [], 'version' => DCRB_THEME_VERSION];

    wp_enqueue_script(
        'dcrb-react-app',
        $theme_uri . '/build/index.js',
        $asset_data['dependencies'],
        $asset_data['version'],
        true
    );

    wp_localize_script(
        'dcrb-react-app',
        'dcrbSettings',
        [
            'restUrl' => esc_url_raw(rest_url()),
            'nonce' => wp_create_nonce('wp_rest'),
            'themeVersion' => DCRB_THEME_VERSION,
        ]
    );
}
add_action('wp_enqueue_scripts', 'dcrb_enqueue_assets');

function dcrb_register_builder_admin_page() {
    add_menu_page(
        __('DCRB Builder', 'd-consulting-react-builder'),
        __('DCRB Builder', 'd-consulting-react-builder'),
        'edit_pages',
        DCRB_BUILDER_PAGE_SLUG,
        'dcrb_render_builder_admin_page',
        'dashicons-layout',
        58
    );
}
add_action('admin_menu', 'dcrb_register_builder_admin_page');

function dcrb_render_builder_admin_page() {
    echo '<div class="wrap">';
    echo '<h1>' . esc_html__('DCRB Builder', 'd-consulting-react-builder') . '</h1>';
    echo '<div id="dcrb-admin-root"></div>';
    echo '</div>';
}

function dcrb_enqueue_admin_assets($hook) {
    if ($hook !== 'toplevel_page_' . DCRB_BUILDER_PAGE_SLUG) {
        return;
    }

    $theme_uri = get_template_directory_uri();
    $theme_dir = get_template_directory();

    wp_enqueue_style(
        'dcrb-admin-style',
        $theme_uri . '/style.css',
        [],
        DCRB_THEME_VERSION
    );

    $asset_path = $theme_dir . '/build/index.asset.php';
    $asset_data = file_exists($asset_path) ? include $asset_path : ['dependencies' => [], 'version' => DCRB_THEME_VERSION];

    wp_enqueue_script(
        'dcrb-admin-app',
        $theme_uri . '/build/index.js',
        $asset_data['dependencies'],
        $asset_data['version'],
        true
    );

    wp_localize_script(
        'dcrb-admin-app',
        'dcrbSettings',
        [
            'restUrl' => esc_url_raw(rest_url()),
            'nonce' => wp_create_nonce('wp_rest'),
            'themeVersion' => DCRB_THEME_VERSION,
            'admin' => true,
        ]
    );
}
add_action('admin_enqueue_scripts', 'dcrb_enqueue_admin_assets');
