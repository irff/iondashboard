import selenium.webdriver
import sys

if len(sys.argv) < 3:
	print "argv<3"
	
url = sys.argv[1]
file_name = sys.argv[2]

driver = selenium.webdriver.PhantomJS()
driver.get(url)
driver.save_screenshot(file_name)
driver.quit()
print "ok"