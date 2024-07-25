package page_objects;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class TableTickers {
    String wrapperSelector = ".table-tickers";

    public boolean hasTicker(WebDriver driver, String ticker) {
        WebElement element = driver.findElement(By.cssSelector(wrapperSelector));
        String text = element.getText();
        return text.contains(ticker);
    }
}
