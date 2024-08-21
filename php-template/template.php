<?php 

function sluggify($input) {
    return strtolower(str_replace(' ', '-', $input));
}

?>

<!-- wp:paragraph -->
<p>The Streets People Love campaign has created scorecards for candidates in the 2024 council elections. Scorecards have been generated based on a candidate's engagement with the Streets People Love campaign, their commitment to our pledge, their responses to a survey and input from campaign members located in the local government area in which they are running.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Have candidates in your local government area not yet taken part? Send your local candidates the <a href="https://forms.gle/gnDNyBiVC64tDo2Y7">Streets People Love Pledge and Survey</a> and ask them to complete it so that local residents can vote for the candidates who want to build the streets people love.</p>
<!-- /wp:paragraph -->

<?php if (isset($media["header.jpg"])): ?>
<!-- wp:image {"id":<?php echo $media["header.jpg"]['id']; ?>,"aspectRatio":"16/9","scale":"cover","sizeSlug":"full","linkDestination":"none"} -->
<figure class="wp-block-image size-full"><img src="<?php echo $media["header.jpg"]['url']; ?>" alt="" class="wp-image-<?php echo $media["header.jpg"]['id']; ?>" style="aspect-ratio:16/9;object-fit:cover"/></figure>
<!-- /wp:image -->
 <?php endif ?>

 <?php 
 
 $wardCount = count($config['wardNames']);

 if ($wardCount > 1) {
    $wardsDescription = $config['councilName'] . " is divided into " . $wardCount . " wards:";
 } else {
    $wardsDescription = $config['councilName'] . " is unsubdivided and does not contain any wards.";
 }

 ?>

 <!-- wp:paragraph -->
<p><?php echo $wardsDescription; ?></p>
<!-- /wp:paragraph -->

<?php if (isset($media["map.jpg"])): ?>
<!-- wp:image {"id":<?php echo $media["map.jpg"]['id']; ?>,"width":"550px","sizeSlug":"full","linkDestination":"media","className":"is-style-default"} -->
<figure class="wp-block-image size-full is-resized is-style-default"><a href="<?php echo $media["map.jpg"]['url']; ?>" target="_blank" rel="noreferrer noopener"><img src="<?php echo $media["map.jpg"]['url']; ?>" alt="" class="wp-image-<?php echo $media["map.jpg"]['id']; ?>" style="width:550px"/></a></figure>
<!-- /wp:image -->
<?php endif ?>

<?php if ($wardCount > 1): ?>

    <?php 

    if ($wardCount > 8) {
        $wardListChunkSize = ceil($wardCount / 2);
    } else {
        $wardListChunkSize = $wardCount;
    }

    $wardChunks = array_chunk($config['wardNames'], $wardListChunkSize);

    ?>
    <!-- wp:columns {"className":"ward-list-columns"} -->
    <div class="wp-block-columns ward-list-columns">

    <?php for ($columnIdx = 0; $columnIdx < 4; $columnIdx++): ?>
        <!-- wp:column {"verticalAlignment":"top","style":{"spacing":{"padding":{"top":"0","bottom":"0"}}}} -->
        <div class="wp-block-column is-vertically-aligned-top" style="padding-top:0;padding-bottom:0">
            
            <?php if (array_key_exists($columnIdx, $wardChunks)): ?>
                <!-- wp:list {"style":{"spacing":{"margin":{"top":"0","right":"0","bottom":"0","left":"0"}}}} -->
                <ul style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0" class="wp-block-list">

                    <?php foreach($wardChunks[$columnIdx] as $wardName): ?>
                        <!-- wp:list-item -->
                        <li><a href="#<?php echo sluggify($wardName); ?>"><?php echo $wardName; ?></a></li>
                        <!-- /wp:list-item -->
                    <?php endforeach; ?>

                </ul>
                <!-- /wp:list -->
            <?php endif; ?>

        </div>
        <!-- /wp:column -->
    <?php endfor; ?>

    </div>
    <!-- /wp:columns -->

<?php endif; ?>

<?php foreach ($config['wardNames'] as $index => $wardName): ?>
    <!-- wp:heading {"level":3,"className":"is-style-default"} -->
    <?php $wardSlug = sluggify($wardName); ?>
    <h3 class="wp-block-heading is-style-default" id="<?php echo $wardSlug; ?>"><a style="text-decoration: none;" href="#<?php echo $wardSlug; ?>"><?php echo $wardName; ?></a></h3>
    <!-- /wp:heading -->

    <?php
    $wardCandidates = array_filter($candidates, function ($candidate) use ($wardName) {
        return isset($candidate["Ward"]) && $candidate["Ward"] === $wardName;
    });

    usort($wardCandidates, function($a, $b) {
        if ($a == $b) {
            return 0;
        }
        return (((int) $a) < ((int) $b)) ? 1 : -1;
    });

    if (count($wardCandidates) > 0):
    ?>

        <?php
        $columnCount = 4;

        $chunkedWardCandidates = array_chunk($wardCandidates, $columnCount);
        ?>

        <?php foreach($chunkedWardCandidates as $chunk): ?>
            <!-- wp:columns -->
            <div class="wp-block-columns">
                
                <?php for ($columnIdx = 0; $columnIdx < $columnCount; $columnIdx++): ?>
                    <!-- wp:column -->
                    <div class="wp-block-column">

                        <?php if (array_key_exists($columnIdx, $chunk)): ?>
                            <?php 
                                $candidate = $chunk[$columnIdx];

                                if (isset($candidate['Picture']) && isset($media[$candidate['Picture']])) {
                                    $candidate_image = $media[$candidate['Picture']];
                                } else {
                                    $candidate_image = $media['default.png'];
                                }

                                $candidate_rating = str_repeat("✔️", max(0, min(5, $candidate['Rating'])));
                                $candidate_rating_colour = "green";

                                // If string is 5 ticks, insert a zero width space entity between the 3rd and 4th ticks so that it wraps nicer
                                if ($candidate_rating == "✔️✔️✔️✔️✔️") {
                                    $candidate_rating = "✔️✔️✔️&#8203;✔️✔️";
                                }
                                // If string is 4 ticks, insert a zero width space entity between the 2nd and 3rd ticks so that it wraps nicer
                                if ($candidate_rating == "✔️✔️✔️✔️") {
                                    $candidate_rating = "✔️✔️&#8203;✔️✔️";
                                }
                            ?>

                            <!-- wp:image {"id":<?php echo $candidate_image['id']; ?>,"width":"200px","height":"200px","scale":"cover","align":"center","style":{"color":{}},"className":"is-resized"} -->
                            <figure class="wp-block-image aligncenter is-resized"><img src="<?php echo $candidate_image['url']; ?>" alt="" class="wp-image-<?php echo $candidate_image['id']; ?>" style="object-fit:cover;width:200px;height:200px"/></figure>
                            <!-- /wp:image -->

                            <!-- wp:heading {"textAlign":"center","className":"wp-block-heading has-text-align-center has-medium-font-size","style":{"spacing":{"margin":{"top":"1rem","bottom":"0.5rem"}}}} -->
                            <h2 class="wp-block-heading has-text-align-center has-medium-font-size" style="margin-top:1rem;margin-bottom:0.5rem"><strong><?php echo $candidate['Candidate Name']; ?></strong></h2>
                            <!-- /wp:heading -->

                            <!-- wp:paragraph {"align":"center","style":{"layout":{"selfStretch":"fit","flexSize":null},"typography":{"lineHeight":"1"},"spacing":{"margin":{"top":"0.5rem","bottom":"1.5rem"}}},"fontSize":"large"} -->
                            <p class="has-text-align-center has-large-font-size" style="margin-top:0.5rem;margin-bottom:1.5rem;line-height:1;color: rgba(100%, 0%, 0%, 0);text-shadow: 0 0 0 <?php echo $candidate_rating_colour; ?>;"><?php echo $candidate_rating; ?></p>
                            <!-- /wp:paragraph -->
                        <?php endif; ?>

                    </div>
                    <!-- /wp:column -->
                <?php endfor; ?>

            </div>
            <!-- /wp:columns -->
        <?php endforeach; ?>
    
    <?php else: ?>

        <!-- wp:paragraph -->
        <p>No candidates in this ward have completed the Streets People Love survey. Send your local candidates the <a href="https://forms.gle/gnDNyBiVC64tDo2Y7">Streets People Love Pledge and Survey</a> and ask them to take part so that local residents can vote for the candidates who want to build the streets people love.</p>
        <!-- /wp:paragraph -->

    <?php endif; ?>

<?php endforeach; ?>

<?php if (isset($config['footer'])): ?>
<!-- wp:paragraph -->
<p><?php echo $config['footer']; ?></p>
<!-- /wp:paragraph -->
<?php endif; ?>