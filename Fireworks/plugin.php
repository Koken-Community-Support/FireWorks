<?php

/**
 *
 */
class KokenCommunityFireworks extends KokenPlugin {

	function __construct() {
		$this->require_setup = false;
		$this->register_hook('before_closing_head', 'renderFirst');
		$this->register_hook('before_closing_body', 'renderMarkUp');
		$this->register_hook('before_closing_body', 'renderLast');
	}

	function renderFirst() {
		echo '<link id="fw_css" rel="stylesheet" type="text/css" href="'. $this->get_path() .'/css/fireworks.min.css">';
	}

	function renderMarkUp($data) {
		$titlePlacement	= $this->data->titlePlacement;
		$greatingOne	= $this->data->greatingOne;
		$greatingTwo	= $this->data->greatingTwo;
		$greatingFont	= $this->data->greatingFont;
		$greatingSize	= $this->data->greatingSize;
		$yearSize		= $this->data->yearSize;
		$greatingColor	= $this->data->greatingColor;
		$yearColor		= $this->data->yearColor;
		$canvasBkgrd	= $this->data->canvasBkgrd;
		$fadeOutTimer	= $this->data->fadeOutTimer;
		$fadeTime		= $this->data->fadeTime;
		$burstTime		= $this->data->burstTime;
		$curYear		= date('Y');
		$siteTitle		= Koken::$site['title'];

		if (!$data['lightbox']) {
			echo '<style id="fw_css_settings" type="text/css">:root {--fw-font-greating:\''. $greatingFont .'\';--fw-size-greating:'. $greatingSize .'vmin;--fw-size-year:'. $yearSize .'vmin;--fw-color-greating:'. $greatingColor .';--fw-color-year:'. $yearColor .'}</style>';
			echo '<div id="fw_center" class="fw-text"><span id="greating">';
			if ($titlePlacement == 'first') {
				echo '<h2>'. $siteTitle .' '. $greatingOne .'</h2>';
				if ( !empty($greatingTwo) ) {
					echo '<h3>7'. $greatingTwo .'7</h3>';
				}
			}
			if ($titlePlacement == 'last') {
				if ( !empty($greatingTwo) ) {
					echo '<h2>'. $greatingOne .'</h2>';
					echo '<h3>7'. $greatingTwo .' '. $siteTitle .'7</h3>';
				} else {
					echo '<h2>'. $greatingOne .' '. $siteTitle .'</h2>';
				}
			}
			if ($titlePlacement == 'hide') {
				echo '<h2>'. $greatingOne .'</h2>';
				if ( !empty($greatingTwo) ) {
					echo '<h3>7'. $greatingTwo .'7</h3>';
				}
			}
			echo '</span><span id="year">'. $curYear .'</span></div>';
			echo '<script id="fw_js_settings">var canvasBkgrd="'. $canvasBkgrd .'";var waitTime='. $fadeOutTimer .';var fadeTime='. $fadeTime .';var fireworksTime='. $burstTime .';</script>';
		}
	}

	function renderLast($data) {
		if (!$data['lightbox']) {
			echo '<script id="fw_gameCanvas" src="'. $this->get_path() .'/js/gameCanvas-3.0.min.js"></script>';
			echo '<script id="fw_main_js" src="'. $this->get_path() .'/js/fireworks.min.js"></script>';
		}
	}
}

?>
