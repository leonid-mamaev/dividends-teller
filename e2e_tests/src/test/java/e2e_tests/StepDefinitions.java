package e2e_tests;
import io.cucumber.java.en.*;
//import org.openqa.selenium.By;
//import org.openqa.selenium.WebDriver;
//import org.openqa.selenium.WebElement;
//import org.openqa.selenium.chrome.ChromeDriver;
import org.junit.jupiter.api.Assertions.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;


public class StepDefinitions {
    private final WebDriver driver = new ChromeDriver();

    @Given("an example scenario")
    public void anExampleScenario() {
    }

    @When("all step definitions are implemented")
    public void allStepDefinitionsAreImplemented() {
    }

    @Then("the scenario passes")
    public void theScenarioPasses() {
    }

    @When("I visit the home page")
    public void visitHomePage() {
        driver.get("http://localhost:3000");
    }

    @When("I set the ticker")
    public void setTicker() {
        WebElement element = driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/form/input[1]"));
        element.sendKeys("AAPL");

    }

    @And("I set the quantity")
    public void iSetQuantity() {
        WebElement element = driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/form/input[2]"));
        element.sendKeys("1");
    }

    @And("I submit the form")
    public void iSubmitForm() {
        WebElement element = driver.findElement(By.xpath("//*[@id=\"root\"]/div/div/form/input[3]"));
        element.click();
    }
}
