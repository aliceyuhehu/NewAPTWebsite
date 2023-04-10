import React from "react";
import {observer} from "mobx-react-lite";
import {FlexboxGrid, IconButton, Panel, Sidebar} from "rsuite";
import {MDXProvider} from "@mdx-js/react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {chapterParts} from "@/pages/textbook/chapters/chapters";
import PageContent from "@/components/PageContent";
import ArrowBackIcon from '@rsuite/icons/ArowBack';
import {useStores} from "@/hooks/useStores";
import {TextbookChat} from "@/components/Textbook/TextbookChat";
import {TextbookThreads} from "@/components/Textbook/TextbookThreads";

export const TextbookContent = observer(() => {

    const location = useLocation();
    const { chapter } = useParams();
    const navigate = useNavigate();

    const { textbookStore } = useStores();
    const { sidebarState } = textbookStore;

    console.log(location);
    console.log(chapter)

    const partToRender = chapterParts.find((part) => part.id === chapter);

    function renderBackButton() {
        return (
            <IconButton
                className="back-button"
                icon={<ArrowBackIcon/>}
                onClick={() => {navigate('/textbook')}}
            >
            </IconButton>
        );
    }

    return (
        <PageContent bodyFill className="textbook-page" header={renderBackButton()}>
        <Panel>
            <>
                <Panel
                    className="textbook-card"
                >
                    <FlexboxGrid>
                        <FlexboxGrid.Item colspan={sidebarState === "closed" ? 24 : 18}>
                        <MDXProvider>
                            {partToRender?.content}
                        </MDXProvider>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={sidebarState === "closed" ? 0 : 6}>
                            {sidebarState === "chat" && <TextbookChat/>}
                            {sidebarState === "threads" && <TextbookThreads/>}
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Panel>
            </>
        </Panel>
        </PageContent>
    );
});