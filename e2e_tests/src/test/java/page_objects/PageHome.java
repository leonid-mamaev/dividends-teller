package page_objects;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import java.nio.file.Paths;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class PageHome {
    public FormAddTicker formAddTicker = new FormAddTicker();
    public TableTickers tableTickers = new TableTickers();

    public void visit(Page page) {
        String url = "http://localhost:3000";
        page.navigate(url);
        page.screenshot(new Page.ScreenshotOptions().setPath(Paths.get("example.png")));
        Locator loading = page.locator("#loading");
        assertThat(loading).isHidden();
    }
}
