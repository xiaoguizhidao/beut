<?php
/**
 * @category		Fishpig
 * @package		Fishpig_Wordpress
 * @license		http://fishpig.co.uk/license.txt
 * @author		Ben Tideswell <help@fishpig.co.uk>
 */

class Fishpig_Wordpress_Controller_Router extends Fishpig_Wordpress_Controller_Router_Abstract
{
	/**
	 * Create an instance of the router and add it to the queue
	 *
	 * @param Varien_Event_Observer $observer
	 * @return bool
	 */
    public function initControllerObserver(Varien_Event_Observer $observer)
    {
    	if (Mage::helper('wordpress')->isEnabled()) {
    		return parent::initControllerObserver($observer);
        }
        
        return false;
    }

	/**
	 * Remove the AW_Blog route to stop conflicts
	 *
	 * @param Varien_Event_Observer $observer
	 * @return bool
	 */
    public function initControllerBeforeObserver(Varien_Event_Observer $observer)
    {
    	if (Mage::helper('wordpress')->isEnabled() && Mage::getDesign()->getArea() === 'frontend') {
	    	$node = Mage::getConfig()->getNode('global/events/controller_front_init_routers/observers');
    	
	    	if (isset($node->blog)) {
		    	unset($node->blog);

		    	Mage::getConfig()->setNode('modules/AW_Blog/active', 'false', true);
		    	Mage::getConfig()->setNode('frontend/routers/blog', null, true);
		    }
        }

        return false;
    }
    	
	/**
	 * Performs the logic for self::match
	 *
	 * @param string $uri
	 * @return bool
	 */
	protected function _match($uri)
	{
		$helper = Mage::helper('wordpress/router');

		Mage::dispatchEvent('wordpress_match_routes_before', array('router' => $this, 'helper' => $helper, 'uri' => $uri));

		if ($uri === '' && $pageId = $helper->getPageId()) {
			return $this->setRoutePath('*/page/view');
		}
		
		if ($helper->isPostUri($uri)) {
			if (($post = Mage::helper('wordpress/post')->loadByPermalink($uri)) !== false) {
				Mage::register('wordpress_post_temp', $post);

				return $this->setRoutePath('*/post/view');
			}
			else if (($postId = Mage::helper('wordpress/post')->getPostId()) !== false) {
				return $this->setRoutePath('*/post/view');
			}
		}
		
		if ($helper->isNoBaseCategoryUri($uri)) {
			return $this->setRoutePath('*/post_category/view');
		}
		
		if ($helper->isPageUri($uri)) {
			return $this->setRoutePath('*/page/view');
		}
		
		if ($helper->isTermUri($uri)) {
			return $this->setRoutePath('*/term/view');
		}
		
		if ($helper->isPostAttachmentUri($uri)) {
			return $this->_redirectFromAttachmentUriToPost($uri);
		}

		Mage::dispatchEvent('wordpress_match_routes_after', array('router' => $this, 'helper' => $helper, 'uri' => $uri));
		
		return $this->_hasValidRouteDetails();
	}

	/**
	 * Adds redirects from attachment pages to parent post
	 * This stops 404 errors showing up in Google Analytics
	 *
	 * @param string $uri
	 * @return bool
	 */
	protected function _redirectFromAttachmentUriToPost($uri)
	{
		if (strpos($uri, '/') !== false) {
			$postUri = substr($uri, 0, strrpos($uri, '/'));
			
			header("HTTP/1.1 301 Moved Permanently");
			header('Location: ' . Mage::helper('wordpress')->getUrl($postUri));
			exit;
		}
		
		return false;
	}

	/**
	 * Initialize the static routes used by WordPress
	 *
	 * @return $this
	 */
	protected function _initStaticRoutes()
	{
		$helper = Mage::helper('wordpress/router');
		
		if (!Mage::helper('wordpress/post')->getPostId() && !$helper->getPageId()) {
			$this->addStaticRoute('/^$/');
		}

		if ($helper->categoryUrlHasBase()) {
			$this->addStaticRoute('/^' . $helper->getCategoryBase() . '\/.*$/i', 'view', 'post_category');
		}
		
		$tagBase = $helper->getTagBase();

		$this	->addStaticRoute('/^' . $tagBase . '\/.*$/', 'view', 'post_tag');
		$this->addStaticRoute('/^author\/.*$/', 'view', 'author');

		// Archive static routes
		$year = '[1-2]{1}[0-9]{3}';
		$month = '[0-1]{1}[0-9]{1}';
		$day = '[0-3]{1}[0-9]{1}';
		
		$this->addStaticRoute('/^' . $year . '\/' . $month . '[\/]{0,1}$/', 'view', 'archive');
		$this->addStaticRoute('/^' . $year . '\/' . $month . '\/' . $day . '[\/]{0,1}$/', 'view', 'archive');
		
		// Search static route
		$this->addStaticRoute('/^search/', 'index', 'search');

		// Forward certain request directly to WP		
		$this->addStaticRoute('/^index.php/i', 'forward');
		$this->addStaticRoute('/^wp-content\/(.*)/i', 'forwardFile');
		$this->addStaticRoute('/^wp-includes\/(.*)/i', 'forwardFile');
		$this->addStaticRoute('/^wp-cron.php.*/', 'forwardFile');
		$this->addStaticRoute('/^wp-admin[\/]{0,1}$/', 'wpAdmin');
		$this->addStaticRoute('/^wp-pass.php.*/', 'applyPostPassword');
		$this->addStaticRoute('/^robots.txt$/i', 'robots');

		$this->addStaticRoute('/^sitemap.xml$/', 'sitemap');		
		
		// Yoast Sitemap - Deprecated. Use Google XML Sitemaps instead
		$this->addStaticRoute('/^[^\/]{0,}sitemap[^\/]{0,}.xml$/', 'legacySitemap');
		
		// Add comments feed
		$this->addStaticRoute('/^comments$/', 'commentsFeed');
		
		return parent::_initStaticRoutes();
	}
}
