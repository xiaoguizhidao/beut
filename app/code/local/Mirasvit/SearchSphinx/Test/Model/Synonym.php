<?php
/**
 * Mirasvit
 *
 * This source file is subject to the Mirasvit Software License, which is available at http://mirasvit.com/license/.
 * Do not edit or add to this file if you wish to upgrade the to newer versions in the future.
 * If you wish to customize this module for your needs
 * Please refer to http://www.magentocommerce.com for more information.
 *
 * @category  Mirasvit
 * @package   Advanced Sphinx Search Pro
 * @version   2.3.1
 * @revision  420
 * @copyright Copyright (C) 2013 Mirasvit (http://mirasvit.com/)
 */


class Mirasvit_SearchSphinx_Test_Model_Synonym extends EcomDev_PHPUnit_Test_Case
{
	/**
	* @test
    * @loadFixture synonyms
	* @doNotIndexAll
	*/
	public function getSynonymsByWord()
	{
		$synonyms = Mage::getModel('searchsphinx/synonym')->getSynonymsByWord('word01');
		$this->assertEquals($synonyms, array('word02', 'word03', 'word04', 'word05'));

		$synonyms = Mage::getModel('searchsphinx/synonym')->getSynonymsByWord('word01x');
		$this->assertEquals($synonyms, array());
	}

	/**
	* @test
    * @loadFixture synonyms
	* @doNotIndexAll
	*/
	public function import()
	{
 		$this->markTestIncomplete(
          'This test has not been implemented yet.'
        );
	}
}
